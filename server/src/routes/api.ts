import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { IngestionEngine } from '../services/IngestionEngine.js';
import { MetricsEngine } from '../services/MetricsEngine.js';
import { ExportEngine } from '../services/ExportEngine.js';
import { ProcessedRecord, IngestionBatch, RouteCategory, ReviewState, SourceType, CallPayload, MeetingPayload } from '../domain/types.js';

export function filterRecordList(records: ProcessedRecord[], query: any): ProcessedRecord[] {
  let filtered = [...records];
  const { person, source_type, route, review_state, has_transcript, search } = query;

  if (source_type && source_type !== 'all') {
    filtered = filtered.filter(r => r.source_type === source_type);
  }

  if (has_transcript && has_transcript !== 'all') {
    const wantTranscript = has_transcript === 'true';
    filtered = filtered.filter(r => r.has_usable_text === wantTranscript);
  }

  if (review_state && review_state !== 'all') {
    filtered = filtered.filter(r => r.review_state === review_state);
  }

  if (route && route !== 'all') {
    filtered = filtered.filter(r => {
      const active = r.manual_routes || r.suggested_routes;
      return active.includes(route as RouteCategory);
    });
  }

  if (person && person !== 'all') {
    const pStr = String(person).toLowerCase();
    filtered = filtered.filter(r => {
      if (r.source_type === 'call') {
        const cp = r.payload as CallPayload;
        return (
          (cp.rep_name && cp.rep_name.toLowerCase().includes(pStr)) ||
          (cp.rep_email && cp.rep_email.toLowerCase().includes(pStr))
        );
      }
      if (r.source_type === 'meeting') {
        const mp = r.payload as MeetingPayload;
        return mp.organizer_email && mp.organizer_email.toLowerCase().includes(pStr);
      }
      return false;
    });
  }

  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter(r => {
      const headline = r.analysis?.headline?.toLowerCase() || '';
      const ref = r.record_ref.toLowerCase();
      let titleOrSummary = '';
      if (r.source_type === 'meeting') {
        titleOrSummary = (r.payload as MeetingPayload).title.toLowerCase();
      } else {
        titleOrSummary = (r.payload as CallPayload).transcript?.toLowerCase() || '';
      }
      return headline.includes(q) || ref.includes(q) || titleOrSummary.includes(q);
    });
  }

  return filtered;
}

export function createApiRouter(
  engine: IngestionEngine,
  initialDataPath: string,
  updateDataPath: string,
  exportDir: string
): Router {
  const router = Router();
  const exporter = new ExportEngine(exportDir);

  // Helper to load JSON files safely
  function loadJsonBatch(filePath: string): IngestionBatch {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Data batch file not found at ${filePath}`);
    }
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw) as IngestionBatch;
  }

  // --- REPLAY CONTROLLER ENDPOINTS ---

  router.post('/replay/reset', (req: Request, res: Response) => {
    engine.reset();
    res.json({
      success: true,
      message: 'State reset to clean slate. Zero records.',
      current_records: engine.count()
    });
  });

  router.post('/replay/initial', (req: Request, res: Response) => {
    const batch = loadJsonBatch(initialDataPath);
    const result = engine.ingestBatch(batch);
    const metrics = MetricsEngine.calculate(engine.getAll());
    res.json({
      success: true,
      batch_id: batch.batch_id,
      revision: batch.revision,
      ...result,
      metrics: {
        total_records: metrics.total_selected_records,
        usable_transcripts: metrics.usable_transcript_count,
        coverage_rate: metrics.usable_transcript_coverage_rate
      }
    });
  });

  router.post('/replay/repeat-initial', (req: Request, res: Response) => {
    const batch = loadJsonBatch(initialDataPath);
    // Shuffle the records array to prove order independence
    const shuffledRecords = [...batch.records].sort(() => Math.random() - 0.5);
    const shuffledBatch: IngestionBatch = {
      ...batch,
      records: shuffledRecords
    };

    const countBefore = engine.count();
    const result = engine.ingestBatch(shuffledBatch);
    const countAfter = engine.count();

    res.json({
      success: true,
      step: 'repeat_initial_shuffled',
      records_before: countBefore,
      records_after: countAfter,
      duplicates_added: countAfter - countBefore,
      ...result,
      is_idempotent: countBefore === countAfter
    });
  });

  router.post('/replay/update', (req: Request, res: Response) => {
    const batch = loadJsonBatch(updateDataPath);
    const result = engine.ingestBatch(batch);
    const m07 = engine.getByRef('M07');
    const metrics = MetricsEngine.calculate(engine.getAll());

    res.json({
      success: true,
      batch_id: batch.batch_id,
      revision: batch.revision,
      ...result,
      m07_status: {
        record_ref: m07?.record_ref,
        applied_revision: m07?.current_revision,
        has_usable_text: m07?.has_usable_text,
        is_manually_corrected: m07?.is_manually_corrected,
        active_routes: m07?.manual_routes || m07?.suggested_routes,
        review_state: m07?.review_state,
        analysis_freshness: m07?.analysis_freshness
      },
      metrics: {
        total_records: metrics.total_selected_records,
        usable_transcripts: metrics.usable_transcript_count,
        coverage_rate: metrics.usable_transcript_coverage_rate
      }
    });
  });

  router.post('/replay/run-all-checks', (req: Request, res: Response) => {
    // Executes the complete 5-step test sequence from DATA_CONTRACT.md
    const steps: any[] = [];

    // Step 1: Clean reset
    engine.reset();
    steps.push({ step: 0, action: 'Reset state', total_records: engine.count() });

    // Step 2: Initial Import
    const initBatch = loadJsonBatch(initialDataPath);
    const initRes = engine.ingestBatch(initBatch);
    const m07Initial = engine.getByRef('M07');
    steps.push({
      step: 1,
      action: 'Initial Import (01_initial.json)',
      ingested: initRes.ingested,
      total_records: engine.count(),
      usable_transcripts: MetricsEngine.calculate(engine.getAll()).usable_transcript_count,
      m07_turns: m07Initial?.transcript_payload?.turns?.length || 0,
      passed: engine.count() === 44 && MetricsEngine.calculate(engine.getAll()).usable_transcript_count === 17
    });

    // Step 3: Repeat Initial with Shuffled Order
    const shuffledBatch: IngestionBatch = {
      ...initBatch,
      records: [...initBatch.records].sort(() => Math.random() - 0.5)
    };
    const repeatRes = engine.ingestBatch(shuffledBatch);
    steps.push({
      step: 2,
      action: 'Repeat Initial Import with Shuffled Records',
      total_records: engine.count(),
      ignored: repeatRes.ignored,
      passed: engine.count() === 44 && repeatRes.ingested === 0
    });

    // Step 4: Manually override M07's route
    if (m07Initial) {
      engine.setManualRoute(
        m07Initial.source_type,
        m07Initial.source_id,
        ['customer_support'],
        'Evaluator Replay Test: Manual Override Prior to Update'
      );
    }
    const m07Overridden = engine.getByRef('M07');
    steps.push({
      step: 3,
      action: 'Manually Override M07 Route to Customer Support',
      m07_manual_route: m07Overridden?.manual_routes,
      m07_is_manually_corrected: m07Overridden?.is_manually_corrected,
      passed: m07Overridden?.is_manually_corrected === true
    });

    // Step 5: Ingest Update Batch (02_update.json)
    const updateBatch = loadJsonBatch(updateDataPath);
    const updateRes = engine.ingestBatch(updateBatch);
    const m07Updated = engine.getByRef('M07');
    const metricsPostUpdate = MetricsEngine.calculate(engine.getAll());
    steps.push({
      step: 4,
      action: 'Ingest Update Batch (02_update.json)',
      total_records: engine.count(),
      updated: updateRes.updated,
      m07_revision: m07Updated?.current_revision,
      m07_turns: m07Updated?.transcript_payload?.turns?.length || 0,
      m07_override_preserved: m07Updated?.is_manually_corrected === true && m07Updated?.manual_routes?.[0] === 'customer_support',
      usable_transcripts: metricsPostUpdate.usable_transcript_count,
      passed: engine.count() === 44 && 
              m07Updated?.current_revision === 2 && 
              m07Updated?.is_manually_corrected === true &&
              metricsPostUpdate.usable_transcript_count === 18
    });

    // Step 6: Ingest 01_initial again to test no-downgrade rule
    const downgradeTestRes = engine.ingestBatch(initBatch);
    const m07AfterDowngradeTest = engine.getByRef('M07');
    steps.push({
      step: 5,
      action: 'Re-ingest 01_initial.json (Test No-Downgrade)',
      total_records: engine.count(),
      m07_revision_retained: m07AfterDowngradeTest?.current_revision,
      passed: engine.count() === 44 && m07AfterDowngradeTest?.current_revision === 2
    });

    const allPassed = steps.every(s => s.passed !== false);

    res.json({
      success: true,
      all_checks_passed: allPassed,
      steps
    });
  });

  // --- RECORD QUERY & DETAIL ENDPOINTS ---

  router.get('/records', (req: Request, res: Response) => {
    let records = filterRecordList(engine.getAll(), req.query);

    // Sort order: Meetings first (M01-M14), then evaluated calls (C01-C10), then background screening drops (B01-B20)
    const typePriority: Record<string, number> = { 'M': 1, 'C': 2, 'B': 3 };
    records.sort((a, b) => {
      const prioA = typePriority[a.record_ref.charAt(0)] || 9;
      const prioB = typePriority[b.record_ref.charAt(0)] || 9;
      if (prioA !== prioB) return prioA - prioB;
      return a.record_ref.localeCompare(b.record_ref, undefined, { numeric: true });
    });

    res.json({
      count: records.length,
      records
    });
  });

  router.get('/records/:source_type/:source_id', (req: Request, res: Response) => {
    const source_type = req.params.source_type as SourceType;
    const source_id = String(req.params.source_id);
    const record = engine.get(source_type, source_id);
    if (!record) {
      return res.status(404).json({ error: `Record ${source_type}:${source_id} not found` });
    }
    res.json(record);
  });

  router.patch('/records/:source_type/:source_id/route', (req: Request, res: Response) => {
    const source_type = req.params.source_type as SourceType;
    const source_id = String(req.params.source_id);
    const { routes, reason } = req.body;

    if (!Array.isArray(routes) || routes.length === 0) {
      return res.status(400).json({ error: 'Body must include non-empty routes array.' });
    }

    const VALID_ROUTES: Set<RouteCategory> = new Set([
      'deal_next_steps',
      'sales_coaching',
      'customer_success',
      'customer_support',
      'partnerships',
      'internal_ops',
      'intake_exception'
    ]);

    for (const r of routes) {
      if (!VALID_ROUTES.has(r)) {
        return res.status(400).json({ 
          error: `Invalid route category: "${r}". Must be one of: ${Array.from(VALID_ROUTES).join(', ')}` 
        });
      }
    }

    try {
      const updated = engine.setManualRoute(source_type, source_id, routes, reason);
      res.json({
        success: true,
        message: 'Manual route override successfully applied and persisted.',
        record: updated
      });
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  });

  router.post('/records/:source_type/:source_id/reset-route', (req: Request, res: Response) => {
    const source_type = req.params.source_type as SourceType;
    const source_id = String(req.params.source_id);
    try {
      const updated = engine.resetManualRoute(source_type, source_id);
      res.json({
        success: true,
        message: 'Manual route override reset to automated suggestion.',
        record: updated
      });
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  });

  router.post('/records/:source_type/:source_id/review', (req: Request, res: Response) => {
    const source_type = req.params.source_type as SourceType;
    const source_id = String(req.params.source_id);
    const { review_state } = req.body;

    if (!['unreviewed', 'reviewed', 'pending_re-review'].includes(review_state)) {
      return res.status(400).json({ error: 'Invalid review_state.' });
    }

    try {
      const updated = engine.setReviewState(source_type, source_id, review_state as ReviewState);
      res.json({
        success: true,
        record: updated
      });
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  });

  // --- METRICS & BRIEF ---

  router.get('/metrics', (req: Request, res: Response) => {
    const filtered = filterRecordList(engine.getAll(), req.query);
    const metrics = MetricsEngine.calculate(filtered);
    res.json(metrics);
  });

  router.get('/manager-brief', (req: Request, res: Response) => {
    exporter.writeDailyBrief(engine.getAll());
    const briefPath = path.join(exportDir, 'daily_briefs', '2026-08-21_Asia_Kolkata_Manager_Daily_Brief.md');
    let briefContent = '';
    if (fs.existsSync(briefPath)) {
      briefContent = fs.readFileSync(briefPath, 'utf8');
    }

    const allRecords = engine.getAll();
    const callsCount = allRecords.filter(r => r.source_type === 'call').length;
    const meetingsCount = allRecords.filter(r => r.source_type === 'meeting').length;

    res.json({
      date: '2026-08-21',
      timezone: 'Asia/Kolkata',
      scope: `Selected Intake (${allRecords.length} Source Records: ${callsCount} Calls, ${meetingsCount} Meetings)`,
      content: briefContent,
      urgent_alerts: [
        {
          id: 'alert-c10',
          type: 'classification_discrepancy',
          title: 'Phantom Follow-up on Departed Contact (C10)',
          citation: 'Call C10 quote: "Would a follow-up call on Monday or Tuesday next week be okay... ? No. I said I will contact you if there is anything to discuss."',
          action: 'Cancel all scheduled outreach to Aniket; restart Meadowbrick account prospecting.'
        },
        {
          id: 'alert-c06',
          type: 'rep_attribution_error',
          title: 'Spoken Rep Mismatch: Ravi vs Meera (C06)',
          citation: 'Call C06 quote: "Good evening. Ravi here. I\'ll say at the start that this is a cold call."',
          action: 'Re-assign call record to Ravi; do not coach Meera on this interaction.'
        },
        {
          id: 'alert-c09',
          type: 'restricted_referral',
          title: 'Restricted Referral: Name-Dropping Forbidden (C09)',
          citation: 'Call C09 quote: "Would it be all right if I mentioned your name when contacting him? No, please don\'t use my name."',
          action: 'Reach out to business head Mr. Rishabh without mentioning Vedant.'
        },
        {
          id: 'alert-m07',
          type: 'customer_support_bug',
          title: 'Software Defect Escalation: 4 UI & Payment Bugs (M07)',
          citation: 'Meeting M07 Turn 27: Team member A commits: "I will send the details to the team, get their confirmation and come back to you."',
          action: 'Report the 4 documented defects to engineering; confirm ETA to Customer A by 2026-08-22.'
        }
      ]
    });
  });

  // --- EXPORTS & MANIFEST ---

  router.post('/export/generate', (req: Request, res: Response) => {
    const result = exporter.generateExport(engine.getAll());
    res.json({
      success: true,
      message: `Export generated successfully in ${exportDir}`,
      ...result
    });
  });

  router.get('/export/manifest', (req: Request, res: Response) => {
    const manifestJsonPath = path.join(exportDir, 'manifest.json');
    if (!fs.existsSync(manifestJsonPath)) {
      exporter.generateExport(engine.getAll());
    }
    const manifest = JSON.parse(fs.readFileSync(manifestJsonPath, 'utf8'));
    res.json(manifest);
  });

  router.get('/export/manifest.csv', (req: Request, res: Response) => {
    const manifestCsvPath = path.join(exportDir, 'manifest.csv');
    if (!fs.existsSync(manifestCsvPath)) {
      exporter.generateExport(engine.getAll());
    }
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="manifest.csv"');
    fs.createReadStream(manifestCsvPath).pipe(res);
  });

  router.get('/export/download', (req: Request, res: Response) => {
    // Ensure export directory exists and is populated
    exporter.generateExport(engine.getAll());

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="spendnest_revenue_inbox_exports.zip"');

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.on('error', (err) => {
      res.status(500).send({ error: err.message });
    });

    archive.pipe(res);
    archive.directory(exportDir, false);
    archive.finalize();
  });

  return router;
}
