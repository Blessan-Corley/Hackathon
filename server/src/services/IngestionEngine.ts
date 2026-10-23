import fs from 'fs';
import {
  IngestionBatch,
  ProcessedRecord,
  RawEnvelopeRecord,
  RouteCategory,
  ReviewState,
  SourceType
} from '../domain/types.js';
import { DOSSIERS, getFallbackAnalysis } from '../analysis/dossiers.js';

export class IngestionEngine {
  // Keyed strictly by composite identity `${source_type}:${source_id}`
  private records: Map<string, ProcessedRecord> = new Map();
  private persistencePath?: string;

  constructor(persistencePath?: string) {
    this.persistencePath = persistencePath;
  }

  public static makeKey(source_type: SourceType, source_id: string): string {
    return `${source_type}:${source_id}`;
  }

  public reset(): void {
    this.records.clear();
    if (this.persistencePath && fs.existsSync(this.persistencePath)) {
      try {
        fs.unlinkSync(this.persistencePath);
      } catch (err) {
        // ignore deletion error
      }
    }
  }

  public getAll(): ProcessedRecord[] {
    return Array.from(this.records.values());
  }

  public get(source_type: SourceType, source_id: string): ProcessedRecord | undefined {
    return this.records.get(IngestionEngine.makeKey(source_type, source_id));
  }

  public getByRef(record_ref: string): ProcessedRecord | undefined {
    for (const record of this.records.values()) {
      if (record.record_ref === record_ref) {
        return record;
      }
    }
    return undefined;
  }

  public count(): number {
    return this.records.size;
  }

  public ingestBatch(batch: IngestionBatch): {
    ingested: number;
    updated: number;
    ignored: number;
    total: number;
  } {
    let ingested = 0;
    let updated = 0;
    let ignored = 0;

    for (const rawRecord of batch.records) {
      const result = this.upsertRecord(rawRecord, batch.batch_id, batch.revision);
      if (result === 'ingested') ingested++;
      else if (result === 'updated') updated++;
      else ignored++;
    }

    this.persist();

    return {
      ingested,
      updated,
      ignored,
      total: this.records.size
    };
  }

  private upsertRecord(
    raw: RawEnvelopeRecord,
    batch_id: string,
    revision: number
  ): 'ingested' | 'updated' | 'ignored' {
    const key = IngestionEngine.makeKey(raw.source_type, raw.source_id);
    const existing = this.records.get(key);

    // Rule 2: Same or older revisions are ignored
    if (existing && revision <= existing.current_revision) {
      return 'ignored';
    }

    const hasUsableText = this.computeHasUsableText(raw);
    const textLength = this.computeTextLength(raw);
    const speakerCount = this.computeSpeakerCount(raw);

    // Get suggested routes and analysis for this record
    const dossierEntry = DOSSIERS[raw.record_ref];
    const suggestedRoutes: RouteCategory[] = dossierEntry ? dossierEntry.routes : (hasUsableText ? (['deal_next_steps'] as RouteCategory[]) : (['intake_exception'] as RouteCategory[]));
    const analysis = dossierEntry 
      ? dossierEntry.analysis(revision) 
      : getFallbackAnalysis(raw.record_ref, raw.source_type, raw.payload, raw.transcript_payload);

    if (!existing) {
      // Brand new record
      const record: ProcessedRecord = {
        identity: key,
        source_type: raw.source_type,
        source_id: raw.source_id,
        record_ref: raw.record_ref,
        current_revision: revision,
        last_batch_id: batch_id,
        updated_at: new Date().toISOString(),

        payload: raw.payload,
        transcript_payload: raw.transcript_payload,

        suggested_routes: suggestedRoutes,
        manual_routes: null,
        manual_override_reason: null,
        manual_override_at: null,
        is_manually_corrected: false,

        review_state: 'unreviewed',
        analysis_freshness: hasUsableText ? 'fresh' : 'not_applicable',
        analysis,

        has_usable_text: hasUsableText,
        text_length_chars: textLength,
        speaker_count_computed: speakerCount
      };

      this.records.set(key, record);
      return 'ingested';
    }

    // Existing record with HIGHER revision
    // Rule 3: Replace full payload & transcript payload (no partial merge)
    // Rule 4: Retain manual route, override reason, review state
    // Rule 5: If source text changed, update analysis and flag freshness
    const hadTextBefore = existing.has_usable_text;
    const isTextNewlyArrived = !hadTextBefore && hasUsableText;

    existing.current_revision = revision;
    existing.last_batch_id = batch_id;
    existing.updated_at = new Date().toISOString();
    existing.payload = raw.payload;
    existing.transcript_payload = raw.transcript_payload;
    existing.has_usable_text = hasUsableText;
    existing.text_length_chars = textLength;
    existing.speaker_count_computed = speakerCount;

    // Suggested routes can change with newer revision
    existing.suggested_routes = suggestedRoutes;
    // Analysis gets updated with newer revision
    existing.analysis = analysis;

    // If text newly arrived or changed, mark analysis freshness
    if (isTextNewlyArrived) {
      existing.analysis_freshness = 'stale_pending_re-review';
      existing.review_state = 'pending_re-review';
    } else {
      existing.analysis_freshness = hasUsableText ? 'fresh' : 'not_applicable';
    }

    // Explicit manual routes are PRESERVED! (Rule 4)
    // is_manually_corrected remains intact.

    return 'updated';
  }

  public setManualRoute(
    source_type: SourceType,
    source_id: string,
    routes: RouteCategory[],
    reason?: string
  ): ProcessedRecord {
    const key = IngestionEngine.makeKey(source_type, source_id);
    const record = this.records.get(key);
    if (!record) {
      throw new Error(`Record not found: ${key}`);
    }

    record.manual_routes = routes;
    record.manual_override_reason = reason || 'Manual route applied by sales manager';
    record.manual_override_at = new Date().toISOString();
    record.is_manually_corrected = true;
    record.review_state = 'reviewed';
    record.analysis_freshness = 'fresh';

    this.persist();
    return record;
  }

  public resetManualRoute(source_type: SourceType, source_id: string): ProcessedRecord {
    const key = IngestionEngine.makeKey(source_type, source_id);
    const record = this.records.get(key);
    if (!record) {
      throw new Error(`Record not found: ${key}`);
    }

    record.manual_routes = null;
    record.manual_override_reason = null;
    record.manual_override_at = null;
    record.is_manually_corrected = false;

    this.persist();
    return record;
  }

  public setReviewState(
    source_type: SourceType,
    source_id: string,
    reviewState: ReviewState
  ): ProcessedRecord {
    const key = IngestionEngine.makeKey(source_type, source_id);
    const record = this.records.get(key);
    if (!record) {
      throw new Error(`Record not found: ${key}`);
    }

    record.review_state = reviewState;
    if (reviewState === 'reviewed' && record.analysis_freshness === 'stale_pending_re-review') {
      record.analysis_freshness = 'fresh';
    }

    this.persist();
    return record;
  }

  private computeHasUsableText(raw: RawEnvelopeRecord): boolean {
    if (raw.source_type === 'call') {
      const call = raw.payload as any;
      return typeof call.transcript === 'string' && call.transcript.trim().length > 0;
    }
    if (raw.source_type === 'meeting') {
      const tp = raw.transcript_payload;
      return !!(tp && Array.isArray(tp.turns) && tp.turns.length > 0);
    }
    return false;
  }

  private computeTextLength(raw: RawEnvelopeRecord): number {
    if (raw.source_type === 'call') {
      const call = raw.payload as any;
      return call.transcript ? call.transcript.length : 0;
    }
    if (raw.source_type === 'meeting') {
      const tp = raw.transcript_payload;
      if (!tp || !Array.isArray(tp.turns)) return 0;
      return tp.turns.reduce((acc, t) => acc + (t.text ? t.text.length : 0), 0);
    }
    return 0;
  }

  private computeSpeakerCount(raw: RawEnvelopeRecord): number {
    if (raw.source_type === 'call') {
      const call = raw.payload as any;
      return call.speaker_count || 1;
    }
    if (raw.source_type === 'meeting') {
      const tp = raw.transcript_payload;
      if (!tp || !Array.isArray(tp.turns) || tp.turns.length === 0) return 0;
      const speakers = new Set(tp.turns.map(t => t.speaker));
      return speakers.size;
    }
    return 0;
  }

  private persist(): void {
    if (!this.persistencePath) return;
    try {
      const data = JSON.stringify(Array.from(this.records.entries()), null, 2);
      fs.writeFileSync(this.persistencePath, data, 'utf8');
    } catch (err) {
      console.error('Failed to persist store:', err);
    }
  }

  public loadPersistence(): boolean {
    if (!this.persistencePath || !fs.existsSync(this.persistencePath)) {
      return false;
    }
    try {
      const raw = fs.readFileSync(this.persistencePath, 'utf8');
      const entries: [string, ProcessedRecord][] = JSON.parse(raw);
      this.records = new Map(entries);
      return true;
    } catch (err) {
      console.error('Failed to load persistence:', err);
      return false;
    }
  }
}
