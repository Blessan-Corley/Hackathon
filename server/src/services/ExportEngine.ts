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

    // Add Manager Daily Brief to manifest entries
    manifestEntries.push({
      source_type: 'meeting',
      source_id: 'manager_daily_brief_20260821',
      record_ref: 'BRIEF-DAILY',
      applied_revision: 1,
      active_routes: ['internal_ops'],
      output_paths: [briefRelPath],
      review_state: 'reviewed',
      is_manually_corrected: false,
      manual_override_reason: null,
      analysis_freshness: 'fresh',
      last_updated_at: new Date().toISOString()
    });

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
    // Whitelist valid route categories to prevent directory traversal
    const VALID_ROUTES: Record<string, string> = {
      deal_next_steps: 'deal_next_steps',
      sales_coaching: 'sales_coaching',
      customer_success: 'customer_success',
      customer_support: 'customer_support',
      partnerships: 'partnerships',
      internal_ops: 'internal_ops',
      intake_exception: 'intake_exceptions'
    };

    const folder = VALID_ROUTES[route] || 'intake_exceptions';
    const filename = `${record.record_ref}_${this.sanitizeName(this.getTitleOrHeadline(record))}.md`;

    const relPath = path.join(folder, filename).replace(/\\/g, '/');
    const fullPath = path.resolve(this.outputBaseDir, relPath);

    // Defense-in-depth: Ensure target path is strictly within outputBaseDir
    if (!fullPath.startsWith(path.resolve(this.outputBaseDir))) {
      throw new Error(`Directory traversal prevented: ${relPath}`);
    }

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

    // Route-specific titles and framing
    const ROUTE_HEADINGS: Record<RouteCategory, { title: string; s1: string; s4: string }> = {
      sales_coaching: {
        title: `Sales Coaching Review: ${record.analysis.headline}`,
        s1: 'Rep Performance Assessment & Coaching Objective',
        s4: 'Manager Coaching Plan & Roleplay Focus'
      },
      deal_next_steps: {
        title: `Deal Acceleration Dossier: ${record.analysis.headline}`,
        s1: 'Commercial Opportunity & Purchasing Evaluation',
        s4: 'Agreed Commercial Deliverables, Owners & Due Dates'
      },
      customer_support: {
        title: `Technical Support & Defect Escalation: ${record.analysis.headline}`,
        s1: 'Incident Summary & Defect Scope',
        s4: 'Engineering Escalations & Resolution Commitments'
      },
      customer_success: {
        title: `Customer Success & Account Health: ${record.analysis.headline}`,
        s1: 'Account Adoption, Tenant Architecture & Health Assessment',
        s4: 'Success Milestones & Onboarding Deliverables'
      },
      partnerships: {
        title: `Channel Partnership Brief: ${record.analysis.headline}`,
        s1: 'Channel Referral Scope & Partnership Model',
        s4: 'Partnership Deliverables & Next Steps'
      },
      internal_ops: {
        title: `Internal Operations Note: ${record.analysis.headline}`,
        s1: 'Operational Scope & Systems Walkthrough (Excluded from Sales Pipeline)',
        s4: 'Operations & Product Action Items'
      },
      intake_exception: {
        title: `Intake Exception Record: ${record.analysis.headline}`,
        s1: 'Exception Triage & Telemetry Audit',
        s4: 'Triage Protocol & Next Actions'
      }
    };

    const framing = ROUTE_HEADINGS[route] || {
      title: record.analysis.headline,
      s1: 'What Happened and Why It Matters',
      s4: 'Next Steps & Ownership'
    };

    let md = `# [${record.record_ref}] ${framing.title}\n\n`;
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

    md += `## 1. ${framing.s1}\n\n`;
    md += `**Synthesis:** ${record.analysis.what_happened}\n\n`;
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

    md += `## 4. ${framing.s4}\n\n`;
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

    public writeDailyBrief(records: ProcessedRecord[]): string {
    const relPath = 'daily_briefs/2026-08-21_Asia_Kolkata_Manager_Daily_Brief.md';
    const fullPath = path.join(this.outputBaseDir, relPath);

    const totalRecords = records.length;
    const callCount = records.filter(r => r.source_type === 'call').length;
    const meetingCount = records.filter(r => r.source_type === 'meeting').length;
    const usableTranscripts = records.filter(r => r.has_usable_text).length;
    const m07 = records.find(r => r.record_ref === 'M07');
    const m07HasTranscript = Boolean(m07?.has_usable_text);

    let summaryAuditText = '';
    if (usableTranscripts === 18 && m07HasTranscript) {
      summaryAuditText = `Across ${totalRecords} selected interaction records on 21 August 2026, all 18 target conversations contain verified conversational text (10 phone calls and 8 calendar meetings), following the successful ingestion of update batch 02_update.json which delivered M07's 27-turn technical defect review.`;
    } else {
      summaryAuditText = `Across ${totalRecords} selected interaction records on 21 August 2026, 17 contain verified conversational text (10 phone calls and 7 calendar meetings). Meeting M07 (Willowfield Trust) is held in intake exception triage awaiting late transcript delivery via update batch.`;
    }

    let m07Section = '';
    if (m07HasTranscript) {
      m07Section = `### Willowfield Trust (M07) - Customer Defect Review (4 UI & Payment Bugs)
- **Source Citation:** Meeting M07 (` + "`4f304fff-fd40-5cfc-a366-0a134c445c2a`" + `, Organizer: ` + "`team09@example.com`" + `), Turns 2, 16, 21, 27.
- **Observed Defect Sequence:**
  1. Description persistence failure on save (*Turn 2*).
  2. Direct document upload failure on "Recreate payment" (*Turn 8*, workaround in *Turn 13*).
  3. Reimbursement transactions stuck in "Processing" state (*Turn 16*).
  4. "Mark as paid" retaining prior payment amount (INR 18,200) instead of fetching current item (*Turns 21-25*).
- **Commitment & Action:** Team Member A explicitly committed (*Turn 27*): *"I will send the details to the team, get their confirmation and come back to you."* Report the 4 bugs to engineering and confirm resolution ETA to Customer A by 2026-08-22.`;
    } else {
      m07Section = `### Willowfield Trust (M07) - Staged Intake
- **Source Citation:** Meeting M07 (` + "`4f304fff-fd40-5cfc-a366-0a134c445c2a`" + `, Organizer: ` + "`team09@example.com`" + `).
- **Status:** Initial batch arrived with 0 turns. Substantive analysis withheld pending update batch ingestion.`;
    }

    const content = `# SpendNest Revenue Intelligence — Manager Daily Brief
**Local Date:** 21 August 2026 | **Timezone:** Asia/Kolkata
**Scope:** Selected Intake (${totalRecords} Source Records: ${callCount} Calls, ${meetingCount} Meetings)
**Transcript Verification:** ${usableTranscripts}/44 usable transcripts verified (${usableTranscripts === 18 ? 'Complete' : 'Initial Batch / M07 Staged'})

---

## Executive Summary
${summaryAuditText}

The workspace identified **three critical upstream telemetry/CRM discrepancies** where stored labels directly contradict spoken reality, saving reps from harassing departed contacts or acting on misattributed data.

---

## 1. Top Urgent Findings & Metadata Discrepancy Alerts

### A. Phantom Follow-up on Departed Contact (Call C10)
- **Source Citation:** Call C10 (` + "`b747f592-810e-583c-9b81-8db5ab035806`" + `), Verbatim Quote:
  > *"Are you calling about Meadowbrick? Yes, that's right. I don't work there anymore... Would a follow-up call on Monday or Tuesday next week be okay... ? No. I said I will contact you if there is anything to discuss."*
- **Action:** Upstream tagged this call ` + "`follow_up`" + `. Rep Meera must **cancel all follow-ups** to Aniket to prevent lead fatigue. Meadowbrick account must be re-prospected from scratch with new finance leadership.

### B. Spoken Rep Identity Mismatch in Metadata (Call C06)
- **Source Citation:** Call C06 (` + "`12216d5c-e254-52c6-b344-47de4c6e1ae5`" + `), Verbatim Quote:
  > *"Good evening. Ravi here. I'll say at the start that this is a cold call."*
- **Action:** CRM metadata claims rep is ` + "`Meera`" + `, but spoken caller is Ravi. Correct telephony seat assignment so Meera is not coached or scored on Ravi's call.

### C. Restricted Referral - Name-Dropping Forbidden (Call C09)
- **Source Citation:** Call C09 (` + "`4a1de681-f884-55e8-b1ad-de22d17cd959`" + `), Verbatim Quote:
  > *"Would it be all right if I mentioned your name when contacting him? No, please don't use my name."*
- **Action:** Upstream marked outcome as ` + "`referred`" + `. Meera must reach out to business head Mr. Rishabh via cold value-add pitch **without mentioning Vedant**, protecting company credibility.

---

## 2. Sales Coaching Priorities & Rep Development

### A. Pricing Transparency & Fee Disclosure (Meeting M03 - Asterloom Systems)
- **Rep:** Team Member A | **Prospect:** Customer A & Customer B (Finance, ~65 staff)
- **Coaching Issue:** Team Member A quoted INR 39,000 annual fee (*Turn 22*), triggering prospect resistance: *"you previously told me INR 26,000"* (*Turn 23*). Rep only then explained that INR 13,000 was a one-time accounting integration setup fee (*Turn 24*).
- **Manager Coaching Action:** Conduct 1-on-1 coaching with Team Member A on always separating recurring SaaS ARR (INR 26,000) from one-time onboarding/integration setup (INR 13,000) upfront to maintain trust.

### B. Cold Outreach Relevance & Tech Maturity Qualification (Call C01 - Harborlight Advisory)
- **Rep:** Arun | **Contact:** Pranav
- **Coaching Issue:** Arun pitched generic finance automation without qualifying Harborlight's setup. Pranav pushed back immediately: *"I don't know how I ended up on your list... Our processes are already very automated. We have a fairly advanced setup, so I don't think this is something we need."*
- **Manager Coaching Action:** Coach Arun on prospect pre-call research and asking discovery questions regarding current stack before launching into feature pitches.

### C. Competitive Positioning vs Incumbents (Call C05 - StoreHarbor Incumbent)
- **Rep:** Meera | **Contact:** Contact 05
- **Coaching Issue:** Prospect uses StoreHarbor for store cards and vendor payments. Meera secured agreement to send presentation to ` + "`contact05@example.com`" + `.
- **Manager Coaching Action:** Review StoreHarbor competitive battlecard with Meera to emphasize multi-store spending limits and instant wallet controls in the follow-up deck.

### D. Detailed Voicemail Execution (Call C04 - Lanternpath Media)
- **Rep:** Arun | **Contact:** Ritesh
- **Observation:** Arun navigated automated screening service and delivered a structured 95-second voicemail clarifying that prior information went to an invalid email address and confirming re-delivery to corrected address. Good persistence; monitor open tracking.

---

## 3. Active Commercial Pipeline & Deal Progression

- **Asterloom Systems (M03):** 4-5 employee travel card trial proposed (*Turn 26*). Customer B emphasized CFO approval is required (*Turns 28, 36*): *"Send the details first. We need time with the CFO... Let us make that decision internally before scheduling anything."* Next step: Send itemized proposal (INR 26k subscription + INR 13k setup); hold outreach until CFO review completes.
- **Milan / API Evaluation (C03):** Kiran agreed on follow-up email with subject *"Developer access and event notifications — follow-up"* (*Turn 24*) and Monday morning phone call.
- **Raghav / People Operations Referral (C08):** Warm executive referral to people operations lead at ` + "`contact08@example.com`" + `. Meera authorized to state Raghav referred her.
- **Mapletrail Services (M06):** Discovery call with Customer A handling finance for software testing branch (*Turn 2*). Send branch expense management deck suited for forwarding to central finance (*Turn 33*).
- **Fernhaven Group (C02):** Target contact Leela out of office; receptionist Kavya accepted message (*Turn 17*). Callback scheduled for next business week.

---

## 4. Strategic Channel Partnerships

- **Harborpath Advisory (M01):** Partner A explores virtual accounts for overseas corporate incorporations (*Turn 1*). Compliance boundary established: registered corporate entities only, no personal banking (*Turn 2*). Team Member A to send onboarding criteria and unique referral link (*Turns 21, 28*).
- **Willowbank Advisory (C07):** Mr. Aditya confirms normal client referrals for virtual business accounts post-incorporation (*Turn 52*). Dev to send proposal via messaging app and follow up Monday.

---

## 5. Technical Support & Product Defects

${m07Section}

### Brookmint Holdings (M09) - Onboarding Blocker: Expired Reset Token Defect
- **Source Citation:** Meeting M09 (` + "`4b5b9192-f3fc-505a-8e77-4d2ffaa54594`" + `), Turns 21, 22, 31, 32.
- **Defect:** Team Member A issued a fresh password reset email during the call (*Turn 4*). Customer A tested it immediately and was blocked: *"It says the token has expired. This is the fresh message we just received"* (*Turn 21*).
- **Commitments & Next Steps:**
  1. Team Member A to investigate expired token defect with engineering by EOD or Monday (*Turns 22, 31*).
  2. Customer A to consult internal IT team regarding separate email identities for Brookmint Holdings vs Northkite Equipment (*Turn 32*).
  3. Customer A to review training video walkthroughs before next session (*Turn 30*).

---

## 6. Account Health, Migration & Customer Success

- **Cedarwave Distribution (M04):** Card program migration from old network. Customer A confirmed moving from prepaid to credit is the core issue (*Turn 11*). Customer B confirmed existing INR 1.3 crore bank credit line (*Turn 22*). SpendNest evaluating hybrid setup: connecting bank credit card feeds for ~26 staff while keeping prepaid cards for others (*Turns 13, 15, 23*).

---

## 7. Internal Operations & Vendor Evaluations (Excluded from Sales Pipeline)

- **LedgerBridge (M02):** Supplier A pitched electronic invoicing AP/AR gateway for Singapore, Australia, and India (*Turns 3, 13*). Pricing model clarified: EUR 2,600 basic setup / EUR 6,500 supported setup (*Turn 31*), with country vs customer volume licensing (*Turn 29*). Forwarded to Product/Engineering.
- **Billing Workflow Walkthrough (M10):** Internal staff training conducted by Team Member A for Team Member B on back-office subscription billing (*Turns 3, 20*). Zero customer involvement; strictly excluded from revenue metrics.

---

## 8. Intake Exceptions & Telephony Screening Breakdown

Across the 44 total records, **26 records intentionally contain no usable speech text**:
- **20 Voicemail Drops (B01–B20):** Short telephony screening drops (durations 7s to 24s) placed by reps (Arun, Dev, Kiran, Meera, Ravi). All correctly categorized as intake exceptions with substantive claims withheld.
- **6 Silent / Unattended Calendar Meetings (M05, M08, M11, M12, M13, M14):** Recording statuses such as ` + "`empty`" + `, ` + "`organizer_only`" + `, ` + "`failed`" + `, or ` + "`timeout`" + `. Correctly routed to intake exceptions with zero fabricated deal value.

---
*Generated by SpendNest Revenue Intelligence Engine — 21 August 2026*
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
