import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app, engine } from '../../src/server.js';

describe('Tier 2 Integration Test: Full Replay Contract & REST Lifecycle', () => {
  it('Executes the complete 5-step data contract replay sequence via HTTP', async () => {
    // 1. Reset
    const resReset = await request(app).post('/api/replay/reset').expect(200);
    expect(resReset.body.current_records).toBe(0);

    // 2. Initial Import
    const resInit = await request(app).post('/api/replay/initial').expect(200);
    expect(resInit.body.ingested).toBe(44);
    expect(resInit.body.metrics.total_records).toBe(44);
    expect(resInit.body.metrics.usable_transcripts).toBe(17);

    // 3. Repeat Initial Import with Shuffled Records
    const resRepeat = await request(app).post('/api/replay/repeat-initial').expect(200);
    expect(resRepeat.body.duplicates_added).toBe(0);
    expect(resRepeat.body.records_after).toBe(44);
    expect(resRepeat.body.is_idempotent).toBe(true);

    // 4. Manually override M07's route to internal_ops (distinct from system customer_support)
    const m07 = engine.getByRef('M07')!;
    const resOverride = await request(app)
      .patch(`/api/records/${m07.source_type}/${m07.source_id}/route`)
      .send({
        routes: ['internal_ops'],
        reason: 'Manager inspection: triage as internal operations prior to update'
      })
      .expect(200);
    expect(resOverride.body.record.is_manually_corrected).toBe(true);
    expect(resOverride.body.record.manual_routes).toEqual(['internal_ops']);

    // 5. Ingest Update Batch (02_update.json)
    const resUpdate = await request(app).post('/api/replay/update').expect(200);
    expect(resUpdate.body.updated).toBe(1);
    expect(resUpdate.body.metrics.total_records).toBe(44);
    expect(resUpdate.body.metrics.usable_transcripts).toBe(18); // Increases by 1!
    expect(resUpdate.body.m07_status.applied_revision).toBe(2);
    expect(resUpdate.body.m07_status.is_manually_corrected).toBe(true);
    expect(resUpdate.body.m07_status.active_routes).toEqual(['internal_ops']); // Preserved override!

    // 6. Repeat Initial Import to verify NO DOWNGRADE
    const resRepeatAfterUpdate = await request(app).post('/api/replay/repeat-initial').expect(200);
    expect(resRepeatAfterUpdate.body.records_after).toBe(44);
    const m07AfterDowngrade = engine.getByRef('M07')!;
    expect(m07AfterDowngrade.current_revision).toBe(2);

    // 7. Verify all checks endpoint
    const resAllChecks = await request(app).post('/api/replay/run-all-checks').expect(200);
    expect(resAllChecks.body.all_checks_passed).toBe(true);
  });

  it('Filters records by person and source type accurately', async () => {
    // Seed initial
    await request(app).post('/api/replay/initial');

    // Filter by rep Arun (with source_type=call to distinguish rep from organizer)
    const resArunCalls = await request(app).get('/api/records?person=Arun&source_type=call').expect(200);
    expect(resArunCalls.body.count).toBe(15);
    for (const r of resArunCalls.body.records) {
      expect(r.source_type).toBe('call');
      expect(r.payload.rep_name).toBe('Arun');
    }

    // Notice that searching for Arun without source_type returns 16 because arun@example.com is ALSO an organizer on M12!
    const resArunAll = await request(app).get('/api/records?person=Arun').expect(200);
    expect(resArunAll.body.count).toBe(16);

    // Filter by meeting organizer team09@example.com
    const resOrg = await request(app).get('/api/records?person=team09@example.com').expect(200);
    expect(resOrg.body.count).toBe(3);
    for (const r of resOrg.body.records) {
      expect(r.source_type).toBe('meeting');
      expect(r.payload.organizer_email).toBe('team09@example.com');
    }
  });

  it('Fetches Manager Brief with verified alerts', async () => {
    const resBrief = await request(app).get('/api/manager-brief').expect(200);
    expect(resBrief.body.date).toBe('2026-08-21');
    expect(resBrief.body.urgent_alerts.length).toBe(4);
    expect(resBrief.body.urgent_alerts[0].citation).toContain('Call C10');
  });
});
