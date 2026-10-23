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

  it('Generates physical files and machine-readable manifests', () => {
    const result = exporter.generateExport(engine.getAll());

    expect(result.manifestEntries.length).toBe(45); // 44 records + 1 Manager Daily Brief
    expect(fs.existsSync(result.manifestJsonPath)).toBe(true);
    expect(fs.existsSync(result.manifestCsvPath)).toBe(true);

    // Verify manifest JSON contents
    const manifestJson = JSON.parse(fs.readFileSync(result.manifestJsonPath, 'utf8'));
    expect(manifestJson.length).toBe(45);

    // Verify Manager Daily Brief is included in manifest
    const briefEntry = manifestJson.find((e: any) => e.record_ref === 'BRIEF-DAILY');
    expect(briefEntry).toBeDefined();
    expect(briefEntry.output_paths[0]).toContain('daily_briefs');

    // Verify all output paths are RELATIVE and exist physically
    for (const entry of manifestJson) {
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
    const m03Entry = manifestJson.find((e: any) => e.record_ref === 'M03');
    expect(m03Entry).toBeDefined();
    expect(m03Entry.active_routes.length).toBeGreaterThan(1);
    expect(m03Entry.output_paths.length).toBeGreaterThan(1);
  });

  it('Validates CSV format headers and row escaping', () => {
    const result = exporter.generateExport(engine.getAll());
    const csvContent = fs.readFileSync(result.manifestCsvPath, 'utf8');
    const lines = csvContent.trim().split('\n');

    expect(lines.length).toBe(46); // 1 header + 45 rows (44 records + 1 Manager Daily Brief)
    expect(lines[0]).toContain('source_type,source_id,record_ref,applied_revision');
  });
});
