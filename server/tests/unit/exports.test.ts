import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { IngestionEngine } from '../../src/services/IngestionEngine.js';
import { ExportEngine } from '../../src/services/ExportEngine.js';
import { IngestionBatch } from '../../src/domain/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const initialDataPath = path.resolve(__dirname, '../../../candidate/data/01_initial.json');
const updateDataPath = path.resolve(__dirname, '../../../candidate/data/02_update.json');
const testExportDir = path.resolve(__dirname, '../../test_exports');

describe('Tier 1 Unit Test: ExportEngine & Manifest Integrity', () => {
  let engine: IngestionEngine;
  let exporter: ExportEngine;
  let initialBatch: IngestionBatch;

  beforeEach(() => {
    engine = new IngestionEngine();
    exporter = new ExportEngine(testExportDir);
    initialBatch = JSON.parse(fs.readFileSync(initialDataPath, 'utf8'));
    engine.ingestBatch(initialBatch);
  });

  it('Generates physical files and machine-readable manifests with 44 source records and top-level brief metadata', () => {
    const result = exporter.generateExport(engine.getAll());

    expect(result.manifestEntries.length).toBe(44); // strictly 44 source records
    expect(fs.existsSync(result.manifestJsonPath)).toBe(true);
    expect(fs.existsSync(result.manifestCsvPath)).toBe(true);

    // Verify manifest JSON contents
    const manifestJson = JSON.parse(fs.readFileSync(result.manifestJsonPath, 'utf8'));
    expect(manifestJson.export_metadata).toBeDefined();
    expect(manifestJson.export_metadata.total_source_records).toBe(44);
    expect(manifestJson.export_metadata.daily_brief_path).toContain('daily_briefs');
    expect(manifestJson.records.length).toBe(44);

    // Verify Manager Daily Brief physically exists
    const fullBriefPath = path.join(testExportDir, manifestJson.export_metadata.daily_brief_path);
    expect(fs.existsSync(fullBriefPath)).toBe(true);

    // Verify all output paths are RELATIVE and exist physically
    for (const entry of manifestJson.records) {
      expect(entry.source_type).toBeDefined();
      expect(entry.source_id).toBeDefined();
      expect(entry.applied_revision).toBe(1);
      for (const relPath of entry.output_paths) {
        expect(path.isAbsolute(relPath)).toBe(false); // must NOT be absolute!
        const fullPath = path.join(testExportDir, relPath);
        expect(fs.existsSync(fullPath)).toBe(true);
      }
    }

    // Verify multi-route records produce multiple outputs (e.g. M03)
    const m03Entry = manifestJson.records.find((e: any) => e.record_ref === 'M03');
    expect(m03Entry).toBeDefined();
    expect(m03Entry.active_routes.length).toBeGreaterThan(1);
    expect(m03Entry.output_paths.length).toBeGreaterThan(1);
  });

  it('Generates differentiated, non-generic dossiers for multi-route conversations', () => {
    exporter.generateExport(engine.getAll());

    // M03: verify deal_next_steps vs sales_coaching are tailored and non-identical
    const m03DealPath = path.join(testExportDir, 'deal_next_steps/M03_Asterloom_Systems__SpendNest_discus.md');
    const m03CoachPath = path.join(testExportDir, 'sales_coaching/M03_Asterloom_Systems__SpendNest_discus.md');

    expect(fs.existsSync(m03DealPath)).toBe(true);
    expect(fs.existsSync(m03CoachPath)).toBe(true);

    const dealContent = fs.readFileSync(m03DealPath, 'utf8');
    const coachContent = fs.readFileSync(m03CoachPath, 'utf8');

    // Must NOT be byte-identical!
    expect(dealContent).not.toEqual(coachContent);
    expect(coachContent).toContain('Pricing Presentation Coaching');
    expect(dealContent).toContain('Commercial Proposal');
  });

  it('Validates CSV format headers and row escaping with strictly 44 rows', () => {
    const result = exporter.generateExport(engine.getAll());
    const csvContent = fs.readFileSync(result.manifestCsvPath, 'utf8');
    const lines = csvContent.trim().split('\n');

    expect(lines.length).toBe(45); // 1 header + 44 record rows (strictly source records)
    expect(lines[0]).toContain('source_type,source_id,record_ref,applied_revision');
  });
});
