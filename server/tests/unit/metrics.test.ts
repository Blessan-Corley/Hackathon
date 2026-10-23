import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { IngestionEngine } from '../../src/services/IngestionEngine.js';
import { MetricsEngine } from '../../src/services/MetricsEngine.js';
import { IngestionBatch } from '../../src/domain/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const initialDataPath = path.resolve(__dirname, '../../../candidate/data/01_initial.json');
const updateDataPath = path.resolve(__dirname, '../../../candidate/data/02_update.json');

describe('Tier 1 Unit Test: MetricsEngine & Mathematical Integrity', () => {
  let engine: IngestionEngine;
  let initialBatch: IngestionBatch;
  let updateBatch: IngestionBatch;

  beforeEach(() => {
    engine = new IngestionEngine();
    initialBatch = JSON.parse(fs.readFileSync(initialDataPath, 'utf8'));
    updateBatch = JSON.parse(fs.readFileSync(updateDataPath, 'utf8'));
  });

  it('Calculates exact initial metrics and explicitly defined denominators', () => {
    engine.ingestBatch(initialBatch);
    const metrics = MetricsEngine.calculate(engine.getAll());

    expect(metrics.total_selected_records).toBe(44);
    expect(metrics.total_calls).toBe(30);
    expect(metrics.total_meetings).toBe(14);

    // Initial usable transcript coverage: 17 out of 44
    expect(metrics.usable_transcript_count).toBe(17);
    expect(metrics.usable_transcript_denominator).toBe(44);
    expect(metrics.usable_transcript_coverage_rate).toBe(38.6);

    // Call coverage: 10 / 30
    expect(metrics.call_transcript_count).toBe(10);
    expect(metrics.call_transcript_denominator).toBe(30);
    expect(metrics.call_transcript_coverage_rate).toBe(33.3);

    // Meeting coverage (initial): 7 / 14
    expect(metrics.meeting_transcript_count).toBe(7);
    expect(metrics.meeting_transcript_denominator).toBe(14);
    expect(metrics.meeting_transcript_coverage_rate).toBe(50.0);

    // Telephony connection rate: 11 / 30 = 36.7%
    expect(metrics.source_reported_connected_calls).toBe(11);
    expect(metrics.source_reported_evaluated_calls).toBe(30);
    expect(metrics.source_reported_connection_rate).toBe(36.7);
  });

  it('Calculates post-update metrics when M07 transcript arrives', () => {
    engine.ingestBatch(initialBatch);
    engine.ingestBatch(updateBatch);
    const metrics = MetricsEngine.calculate(engine.getAll());

    // Usable transcripts increases from 17 to 18
    expect(metrics.usable_transcript_count).toBe(18);
    expect(metrics.usable_transcript_denominator).toBe(44);
    expect(metrics.usable_transcript_coverage_rate).toBe(40.9);

    // Meeting coverage increases from 7 to 8
    expect(metrics.meeting_transcript_count).toBe(8);
    expect(metrics.meeting_transcript_denominator).toBe(14);
    expect(metrics.meeting_transcript_coverage_rate).toBe(57.1);
  });

  it('Distinguishes call reps from meeting organizers strictly', () => {
    engine.ingestBatch(initialBatch);
    const metrics = MetricsEngine.calculate(engine.getAll());

    const reps = metrics.activity_by_person.call_reps;
    expect(reps.length).toBe(5);

    const arun = reps.find(r => r.name === 'Arun');
    expect(arun).toBeDefined();
    expect(arun?.total_calls).toBe(15);

    const meera = reps.find(r => r.name === 'Meera');
    expect(meera).toBeDefined();
    expect(meera?.total_calls).toBe(5);

    const leela = reps.find(r => r.name === 'Leela');
    expect(leela).toBeDefined();
    expect(leela?.total_calls).toBe(8);

    // Meeting organizers are emails and not confused with reps
    const organizers = metrics.activity_by_person.meeting_organizers;
    expect(organizers.length).toBe(10);
    expect(organizers.some(o => o.email === 'team06@example.com')).toBe(true);
    expect(organizers.some(o => o.email === 'team09@example.com')).toBe(true);
  });
});
