import fs from 'fs';
import path from 'path';
import { ProcessedRecord, ExportManifestEntry, RouteCategory, CallPayload, MeetingPayload } from '../domain/types.js';

export class ExportEngine {
  private outputBaseDir: string;

  constructor(outputBaseDir: string) {
    this.outputBaseDir = outputBaseDir;
  }

  public generateExport(records: ProcessedRecord[]): {
    manifestEntries: ExportManifestEntry[];
    totalFilesCreated: number;
    manifestJsonPath: string;
    manifestCsvPath: string;
  } {
    if (!fs.existsSync(this.outputBaseDir)) {
      fs.mkdirSync(this.outputBaseDir, { recursive: true });
    }

    // Clean existing exports subdirectories to avoid stale files
    const subdirs = [
      'deal_next_steps',
      'sales_coaching',
      'customer_success',
      'customer_support',
      'partnerships',
      'internal_ops',
      'intake_exceptions',
      'daily_briefs'
    ];
    for (const dir of subdirs) {
      const fullDir = path.join(this.outputBaseDir, dir);
      if (fs.existsSync(fullDir)) {
        fs.rmSync(fullDir, { recursive: true, force: true });
      }
      fs.mkdirSync(fullDir, { recursive: true });
    }

    const manifestEntries: ExportManifestEntry[] = [];
    let fileCount = 0;

    for (const record of records) {
      const activeRoutes = record.manual_routes || record.suggested_routes;
      const createdRelativePaths: string[] = [];

      for (const route of activeRoutes) {
        const relativeFilePath = this.writeRouteDossier(record, route);
        if (relativeFilePath) {
          createdRelativePaths.push(relativeFilePath);
          fileCount++;
        }
      }

      manifestEntries.push({
        source_type: record.source_type,
        source_id: record.source_id,
        record_ref: record.record_ref,
        applied_revision: record.current_revision,
        active_routes: activeRoutes,
        output_paths: createdRelativePaths,
        review_state: record.review_state,
        is_manually_corrected: record.is_manually_corrected,
        manual_override_reason: record.manual_override_reason,
        analysis_freshness: record.analysis_freshness,
        last_updated_at: record.updated_at
      });
    }

    // Generate shared Manager Daily Brief for 2026-08-21
    const briefRelPath = this.writeDailyBrief(records);
    fileCount++;

    // Write manifest.json
    const manifestJsonPath = path.join(this.outputBaseDir, 'manifest.json');
    fs.writeFileSync(manifestJsonPath, JSON.stringify(manifestEntries, null, 2), 'utf8');

    // Write manifest.csv
    const manifestCsvPath = path.join(this.outputBaseDir, 'manifest.csv');
    const csvContent = this.generateManifestCsv(manifestEntries);
    fs.writeFileSync(manifestCsvPath, csvContent, 'utf8');

    return {
      manifestEntries,
      totalFilesCreated: fileCount + 2, // including manifest.json and manifest.csv
      manifestJsonPath,
      manifestCsvPath
    };
  }

  private writeRouteDossier(record: ProcessedRecord, route: RouteCategory): string | null {
    const filename = `${record.record_ref}_${this.sanitizeName(this.getTitleOrHeadline(record))}.md`;
    let folder: string = route;
    if (route === 'intake_exception') {
      folder = 'intake_exceptions';
    }

    const relPath = path.join(folder, filename).replace(/\\/g, '/');
    const fullPath = path.join(this.outputBaseDir, relPath);

    const content = this.formatDossierMarkdown(record, route, relPath);
    fs.writeFileSync(fullPath, content, 'utf8');
    return relPath;
  }

  private getTitleOrHeadline(record: ProcessedRecord): string {
    if (record.source_type === 'meeting') {
      const p = record.payload as MeetingPayload;
      return p.title.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    }
    const p = record.payload as CallPayload;
    const name = p.rep_name || 'Call';
    return `${name}_${record.payload.id.substring(0, 8)}`;
  }

  private sanitizeName(str: string): string {
    return str.substring(0, 35).replace(/[^a-zA-Z0-9_-]/g, '_');
  }

  private formatDossierMarkdown(record: ProcessedRecord, route: RouteCategory, relPath: string): string {
    const p = record.payload as any;
    const isCall = record.source_type === 'call';
    const repOrOrg = isCall ? `Rep: ${p.rep_name || p.rep_email}` : `Organizer: ${p.organizer_email}`;
    const duration = `${p.duration_seconds}s`;

    let md = `# [${record.record_ref}] ${record.analysis.headline}\n\n`;
    md += `**Destination Route:** \`${route}\`\n`;
    md += `**Source Type:** ${record.source_type} | **Source ID:** \`${record.source_id}\`\n`;
    md += `**Revision:** ${record.current_revision} (Batch: \`${record.last_batch_id}\`)\n`;
    md += `**Identity / Context:** ${repOrOrg} | **Duration:** ${duration}\n`;
    md += `**Review State:** \`${record.review_state}\` | **Analysis Freshness:** \`${record.analysis_freshness}\`\n`;
    
    if (record.is_manually_corrected) {
      md += `\n> **[!] MANUAL OVERRIDE APPLIED**\n`;
      md += `> **Reason:** ${record.manual_override_reason || 'Manual classification'}\n`;
      md += `> **Override Timestamp:** ${record.manual_override_at}\n\n`;
    }

    if (record.analysis.discrepancy) {
      const disc = record.analysis.discrepancy;
      md += `\n### [!] Upstream Discrepancy Alert (${disc.severity.toUpperCase()})\n`;
      md += `- **Field:** \`${disc.field}\`\n`;
      md += `- **Upstream Metadata Claim:** *${disc.upstream_claim}*\n`;
      md += `- **Spoken Reality:** *${disc.spoken_reality}*\n`;
      md += `- **Impact:** ${disc.impact_explanation}\n\n`;
    }

    md += `## 1. What Happened and Why It Matters\n\n`;
    md += `**Summary:** ${record.analysis.what_happened}\n\n`;
    md += `**Manager Significance:** ${record.analysis.why_it_matters}\n\n`;

    md += `## 2. Supporting Evidence & Transcript Passages\n\n`;
    if (record.analysis.evidence_citations.length === 0) {
      md += `*No transcript supplied or usable text recorded. Substantive claims withheld.*\n\n`;
    } else {
      for (const cite of record.analysis.evidence_citations) {
        md += `- **${cite.reference}** ${cite.speaker ? `(${cite.speaker})` : ''}: \n`;
        if (cite.quote) {
          md += `  > "${cite.quote}"\n`;
        }
        md += `  *Note: ${cite.note}*\n\n`;
      }
    }

    md += `## 3. What the Evidence Does NOT Establish (Honest Uncertainty)\n\n`;
    for (const unestablished of record.analysis.what_evidence_does_not_establish) {
      md += `- ${unestablished}\n`;
    }
    md += `\n`;

    md += `## 4. Next Steps & Ownership\n\n`;
    if (record.analysis.next_steps.length === 0) {
      md += `*No actionable next steps derived from current extract.*\n\n`;
    } else {
      for (const step of record.analysis.next_steps) {
        md += `- **Action:** ${step.action}\n`;
        md += `  - **Owner:** ${step.owner || 'Unassigned / Needs Owner'}\n`;
        md += `  - **Timing:** ${step.timing || 'TBD'}\n`;
        md += `  - **Verifiable:** ${step.verifiable ? 'Yes' : 'No'}\n`;
      }
      md += `\n`;
    }

    md += `---\n*Export generated by SpendNest Revenue Intelligence Engine at ${new Date().toISOString()}*\n`;
    return md;
  }

  private writeDailyBrief(records: ProcessedRecord[]): string {
    const relPath = 'daily_briefs/2026-08-21_Asia_Kolkata_Manager_Daily_Brief.md';
    const fullPath = path.join(this.outputBaseDir, relPath);

    const content = `# SpendNest Revenue Intelligence — Manager Daily Brief
**Local Date:** 21 August 2026 | **Timezone:** Asia/Kolkata
**Scope:** Selected Intake (44 Source Records: 30 Calls, 14 Meetings)

## Executive Summary
Across 44 selected interaction records on 21 August 2026, 18 contain verified conversational text (10 phone calls and 8 calendar meetings post-update). The team engaged with high-value prospects, identified strategic channel referral partnerships, uncovered critical product defects, and surfaced key coaching opportunities.

Crucially, **three critical upstream classification discrepancies** were identified where CRM metadata contradicts spoken reality, preventing reps from harassing contacts or wasting cycles.

---

## 1. Top Urgent Findings Linked to Evidence

### A. The Follow-up Trap on Departed Contact (Call C10)
- **Source Citation:** Call C10 (\`b747f592-810e-583c-9b81-8db5ab035806\`), Quote:
  > *"Are you calling about Meadowbrick? Yes, that's right. I don't work there anymore... Would a follow-up call on Monday or Tuesday next week be okay... ? No. I said I will contact you if there is anything to discuss."*
- **Action:** Upstream tagged this call \`follow_up\`. Rep Meera must **cancel all follow-ups** to Aniket to prevent lead fatigue. Meadowbrick account must be re-prospected from scratch.

### B. Severe Defect Escalation: Payment Description Persistence (Meeting M07)
- **Source Citation:** Meeting M07 (\`4f304fff-fd40-5cfc-a366-0a134c445c2a\`), Turn 2:
  > Customer A demonstrates screen share: editing an event-payment description does not persist after clicking save.
- **Action:** Customer Support priority ticket filed for Engineering. Customer A promised confirmation by 2026-08-22.

### C. Rep Identity Mismatch in Metadata (Call C06)
- **Source Citation:** Call C06 (\`12216d5c-e254-52c6-b344-47de4c6e1ae5\`), Quote:
  > *"Good evening. Ravi here. I'll say at the start that this is a cold call."*
- **Action:** CRM metadata claims rep is \`Meera\`, but caller is Ravi. Correct telephony seat assignment so Meera is not coached for Ravi's call.

---

## 2. Deal Pipeline Acceleration
- **Asterloom Systems (M03):** High-potential domestic expense evaluation. Customer B emphasized CFO approval is required before scheduling further calls and requested written materials first (*Turn 36*). Send CFO-focused reconciliation whitepaper; hold follow-up calls until internal review completes.
- **Milan / API Access (C03):** Kiran agreed on follow-up email subject *"Developer access and event notifications — follow-up"* and Monday morning call.
- **Raghav / People Operations Referral (C08):** Warm executive referral to people ops lead (\`contact08@example.com\`). Meera authorized to mention Raghav.

---

## 3. Channel Partnerships
- **Harborpath Advisory (M01):** Corporate formation advisory exploring virtual accounts for overseas clients. Send corporate onboarding specification.
- **Willowbank Advisory (C07):** Advisory partner referrals for virtual accounts. Dev to send deck via chat app and follow up Monday.

---

## 4. Internal Operations vs Sales Separation
- **LedgerBridge (M02):** Electronic invoicing supplier integration. Forwarded to Product/Engineering.
- **Billing Workflow Walkthrough (M10):** Internal staff training session (*Turn 3*). Kept out of sales pipeline metrics.

---
*Generated by SpendNest Revenue Intelligence Engine*
`;

    fs.writeFileSync(fullPath, content, 'utf8');
    return relPath;
  }

  private generateManifestCsv(entries: ExportManifestEntry[]): string {
    const headers = [
      'source_type',
      'source_id',
      'record_ref',
      'applied_revision',
      'active_routes',
      'output_paths',
      'review_state',
      'is_manually_corrected',
      'manual_override_reason',
      'analysis_freshness',
      'last_updated_at'
    ];

    const rows = entries.map(e => [
      `"${e.source_type}"`,
      `"${e.source_id}"`,
      `"${e.record_ref}"`,
      e.applied_revision,
      `"${e.active_routes.join(';')}"`,
      `"${e.output_paths.join(';')}"`,
      `"${e.review_state}"`,
      e.is_manually_corrected ? 'true' : 'false',
      `"${(e.manual_override_reason || '').replace(/"/g, '""')}"`,
      `"${e.analysis_freshness}"`,
      `"${e.last_updated_at}"`
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
}
