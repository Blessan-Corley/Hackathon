import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { IngestionEngine } from '../../src/services/IngestionEngine.js';
import { IngestionBatch } from '../../src/domain/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const initialDataPath = path.resolve(__dirname, '../../../candidate/data/01_initial.json');
const updateDataPath = path.resolve(__dirname, '../../../candidate/data/02_update.json');

describe('Tier 1 Unit Test: IngestionEngine & Data Contract Replay Rules', () => {
  let engine: IngestionEngine;
  let initialBatch: IngestionBatch;
  let updateBatch: IngestionBatch;

  beforeEach(() => {
    engine = new IngestionEngine(); // in-memory, no persistence file for test
    initialBatch = JSON.parse(fs.readFileSync(initialDataPath, 'utf8'));
    updateBatch = JSON.parse(fs.readFileSync(updateDataPath, 'utf8'));
  });

  it('Boundary: initial state is empty with count 0', () => {
    expect(engine.count()).toBe(0);
    expect(engine.getAll()).toEqual([]);
  });

  it('Rule 1 & 2: Ingesting initial batch yields exactly 44 records with revision 1', () => {
    const result = engine.ingestBatch(initialBatch);
    expect(result.ingested).toBe(44);
    expect(result.updated).toBe(0);
    expect(result.ignored).toBe(0);
    expect(engine.count()).toBe(44);

    const m07 = engine.getByRef('M07');
    expect(m07).toBeDefined();
    expect(m07?.current_revision).toBe(1);
    expect(m07?.has_usable_text).toBe(false);
    expect(m07?.transcript_payload?.turns.length).toBe(0);
  });

  it('Idempotency: Re-ingesting initial batch with shuffled records adds 0 duplicates', () => {
    engine.ingestBatch(initialBatch);
    expect(engine.count()).toBe(44);

    // Shuffle records
    const shuffled: IngestionBatch = {
      ...initialBatch,
      records: [...initialBatch.records].reverse()
    };

    const repeatResult = engine.ingestBatch(shuffled);
    expect(repeatResult.ingested).toBe(0);
    expect(repeatResult.updated).toBe(0);
    expect(repeatResult.ignored).toBe(44);
    expect(engine.count()).toBe(44); // No inflation!
  });

  it('Rule 4: Manual route override persists through batch updates and does not overwrite with system route', () => {
    engine.ingestBatch(initialBatch);
    const m07 = engine.getByRef('M07')!;
    expect(m07.is_manually_corrected).toBe(false);

    // Apply manual override distinct from system route suggestion (internal_ops vs customer_support)
    engine.setManualRoute(
      m07.source_type,
      m07.source_id,
      ['internal_ops'],
      'Test override prior to update'
    );

    const m07Overridden = engine.getByRef('M07')!;
    expect(m07Overridden.is_manually_corrected).toBe(true);
    expect(m07Overridden.manual_routes).toEqual(['internal_ops']);
    expect(m07Overridden.manual_override_reason).toBe('Test override prior to update');

    // Ingest update batch (revision 2)
    const updateResult = engine.ingestBatch(updateBatch);
    expect(updateResult.updated).toBe(1);
    expect(engine.count()).toBe(44); // Still 44 unique records!

    // Verify M07 updated text AND preserved manual override
    const m07Updated = engine.getByRef('M07')!;
    expect(m07Updated.current_revision).toBe(2);
    expect(m07Updated.has_usable_text).toBe(true);
    expect(m07Updated.transcript_payload?.turns.length).toBeGreaterThan(0);
    expect(m07Updated.is_manually_corrected).toBe(true);
    expect(m07Updated.manual_routes).toEqual(['internal_ops']); // Preserved!
    expect(m07Updated.suggested_routes).toEqual(['customer_support']); // System updated independently!
    expect(m07Updated.review_state).toBe('pending_re-review');
    expect(m07Updated.analysis_freshness).toBe('stale_pending_re-review');

    // Contract State Machine Check: Editing route on stale record does NOT magically make analysis fresh
    engine.setManualRoute(m07Updated.source_type, m07Updated.source_id, ['deal_next_steps'], 'Manager routing change');
    const m07RouteChanged = engine.getByRef('M07')!;
    expect(m07RouteChanged.analysis_freshness).toBe('stale_pending_re-review'); // Still stale!

    // Only explicit analytical review clears stale state
    engine.setReviewState(m07RouteChanged.source_type, m07RouteChanged.source_id, 'reviewed');
    const m07Reviewed = engine.getByRef('M07')!;
    expect(m07Reviewed.analysis_freshness).toBe('fresh');
    expect(m07Reviewed.review_state).toBe('reviewed');
  });

  it('Rule 2 (No Downgrade): Re-ingesting initial batch (rev 1) after update (rev 2) is ignored', () => {
    engine.ingestBatch(initialBatch);
    engine.ingestBatch(updateBatch);

    const m07Rev2 = engine.getByRef('M07')!;
    expect(m07Rev2.current_revision).toBe(2);

    // Ingest initial batch again
    const result = engine.ingestBatch(initialBatch);
    expect(result.updated).toBe(0);
    expect(result.ignored).toBe(44);

    const m07StillRev2 = engine.getByRef('M07')!;
    expect(m07StillRev2.current_revision).toBe(2);
    expect(m07StillRev2.has_usable_text).toBe(true);
  });

  it('Reset manual route restores automated suggestion', () => {
    engine.ingestBatch(initialBatch);
    const m07 = engine.getByRef('M07')!;
    engine.setManualRoute(m07.source_type, m07.source_id, ['deal_next_steps'], 'Temporary');
    expect(engine.getByRef('M07')!.is_manually_corrected).toBe(true);

    engine.resetManualRoute(m07.source_type, m07.source_id);
    const restored = engine.getByRef('M07')!;
    expect(restored.is_manually_corrected).toBe(false);
    expect(restored.manual_routes).toBeNull();
  });

  it('Review state transitions: unreviewed -> reviewed', () => {
    engine.ingestBatch(initialBatch);
    const c01 = engine.getByRef('C01')!;
    expect(c01.review_state).toBe('unreviewed');

    engine.setReviewState(c01.source_type, c01.source_id, 'reviewed');
    expect(engine.getByRef('C01')!.review_state).toBe('reviewed');
  });
});
