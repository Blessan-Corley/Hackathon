# SpendNest Revenue Intelligence Inbox

A revenue intelligence triage workspace and idempotent data contract engine designed for frontline sales managers. The platform reconciles CRM activity telemetry across phone calls and meetings, surfaces upstream data discrepancies, preserves human overrides through asynchronous batch updates, and routes conversational intelligence to downstream departments.

---

## 1. System Architecture

The project is structured as a monorepo containing a TypeScript backend engine and a modern React frontend:

- **Backend (`server/`)**: Built with Node.js, Express, and TypeScript. Implements composite identity indexing, idempotent upserting, revision tracking, mathematical metric calculations, multi-destination Markdown dossier generation, and a verification audit engine.
- **Frontend (`client/`)**: Built with React 19, TypeScript, Vite, and Tailwind CSS. Provides a triage inbox, metric dashboards, filter toolbar with custom semantic color indicators, an evidence inspector drawer with turn-by-turn citations, and an interactive data replay drawer.
- **Data Source (`candidate/`)**: Contains original CRM call and meeting payloads (`01_initial.json` and `02_update.json`).
- **Exports (`exports/`)**: Multi-destination dossier folders, `manifest.json` with top-level metadata block, and RFC 4180 compliant `manifest.csv`.

---

## 2. Quick Start

### Option A: Local Node.js Execution

**Prerequisites**: Node.js v18+ (tested on v22) and npm v9+.

```bash
# 1. Install dependencies for all packages
npm install

# 2. Build both client and server production bundles
npm run build

# 3. Start the unified production server
npm start
```

The application is accessible at `http://localhost:4000`.

### Option B: Docker Container

**Prerequisites**: Docker and Docker Compose installed.

```bash
# Build and run containerized application
docker compose up --build

# Run in background (detached mode)
docker compose up -d --build

# Stop the container
docker compose down
```

The service runs on `http://localhost:4000`. Exported dossiers are mapped to `./exports` on the host machine.

---

## 3. Development Scripts

```bash
# Run backend development server with hot-reload
npm run dev:server

# Run frontend development server with Vite HMR
npm run dev:client
```

---

## 4. Test Verification Suite

The repository implements a 3-tier testing pyramid covering contract invariants, calculations, REST lifecycles, and browser interactions.

### Tier 1 & Tier 2: Vitest Unit and Integration Tests

Executes all ingestion rules, revision replacement, denominator assertions, and REST endpoints:

```bash
npm test
```

Test coverage includes:
- Idempotent upsert logic: deduplication over repeated imports.
- Revision retention: verification that Revision 2 is retained when Revision 1 is re-ingested.
- Override preservation: user route edits survive upstream payload refreshes while system routes update independently.
- Metric calculations: verifying explicit denominators and activity distributions.
- Multi-destination export generation: non-generic differentiated dossiers and manifest emission.

### Tier 3: Playwright End-to-End Browser Tests

Executes automated Chromium tests against real DOM interactions:

```bash
npm run test:e2e
```

E2E scenarios verified:
1. Dashboard state and KPI card rendering for 44 total records.
2. Multi-channel and team member filtering with custom dropdowns.
3. Slide-over Evidence Inspector opening with verified turn citations.
4. Execution of the 5-step data contract replay sequence.
5. Daily briefing modal verification with forensic evidence.
6. Export hub and manifest download links.
7. Interactive review state dropdown lifecycle.
8. Hover-expandable rail navigation, Discrepancy Radar, Team Scorecard, and keyboard shortcuts.

---

## 5. Data Contract & Replay Verification

The platform satisfies five core ingestion and idempotency guarantees:

| Step | Action | Contract Guarantee |
| :--- | :--- | :--- |
| **1. Initial Import** | Ingest `01_initial.json` (`POST /api/replay/initial`) | Exactly 44 records loaded (30 calls, 14 meetings). 17 usable transcripts. M07 staged with 0 turns. |
| **2. Repeat Import** | Ingest shuffled initial batch (`POST /api/replay/repeat-initial`) | Composite identity `(source_type, source_id)` deduplication ensures 0 duplicate records. Total remains 44. |
| **3. Manual Correction** | Reassign M07 route (`PATCH /api/records/meeting/:id/route`) | Overrides M07 route to `internal_ops` (distinct from system suggestion) with audit timestamp and manager justification note. |
| **4. Ingest Update** | Ingest `02_update.json` (`POST /api/replay/update`) | M07 updated to Revision 2 with 27 dialogue turns. Total records remains 44. System suggested route updates to `customer_support`, while user manual route override to `internal_ops` is strictly preserved. |
| **5. Test No-Downgrade** | Re-ingest `01_initial.json` (`POST /api/replay/repeat-initial`) | Incoming Revision 1 payload is rejected because Revision 2 is already active. M07 text, turns, and manual route are retained. |

These steps can be executed individually from the UI via the **Sync & Replay Feeds** drawer, or verified automatically by clicking **Run 5-Step Evaluation Suite**.

---

## 6. Metric Definitions & Denominators

All dashboard KPIs are computed with mathematically defined numerators and denominators:

- **Total Records (44)**: Total unique `(source_type, source_id)` entities in the dataset (30 calls, 14 meetings).
- **Transcript Coverage (40.9% post-update)**: Numerator = 18 records with verified conversational text (10 calls, 8 meetings). Denominator = 44 total records.
- **Call Coverage (33.3%)**: Numerator = 10 calls with transcript text. Denominator = 30 total calls.
- **Meeting Coverage (57.1% post-update)**: Numerator = 8 meetings with turns. Denominator = 14 total meetings.
- **Source Telephony Connect Rate (36.7%)**: Numerator = 11 calls flagged `is_connected: true`. Denominator = 30 calls evaluated.
  *Note:* Upstream telephony telemetry reflects carrier signaling: calls B11 (26s) and B14 (9s) report `is_connected: true` with machine unresponsive outcomes, while call C04 reports `is_connected: false` with 95s IVR duration because Arun recorded a voicemail through screening rather than reaching a live prospect (standard telephony protocol).

---

## 7. Strategic Cross-Record Insights & Architectural Decisions

### Breakthrough Cross-Record Findings

1. **The Prepaid vs. Credit Expectation Gap (M03 & M04)**:
   - Across both mid-market commercial meetings on 21 August 2026, prospective buyers entered discussions expecting revolving corporate credit lines and encountered immediate friction upon learning SpendNest issues pre-funded debit cards:
     - **Asterloom Systems (Meeting M03, Turns 6–7)**: Customer A questioned: *"Wait, these are prepaid? I had thought about a corporate credit card. A prepaid card means we have to load funds in advance, which ties up our cash flow."*
     - **Cedarwave Distribution (Meeting M04, Turns 9–11)**: Customer A emphasized: *"moving from prepaid to credit is the main issue for us. At some stage we will have to consider another option for that. We already have a corporate credit line of about INR 1.3 crore."*
   - **Executive Takeaway**: SpendNest's card model creates systematic resistance in accounts with existing banking lines. Sales leadership must equip reps with a clear hybrid messaging strategy (ingesting bank credit card feeds for senior executives while using prepaid cards for frontline staff) rather than positioning prepaid cards as a blanket credit replacement.

2. **The 23:51–23:59 IST Automated Dialer Burst (B01–B20)**:
   - All 20 background unreached calls occurred in an 8-minute burst right before midnight: between **23:51:02 and 23:59:29 IST** (18:21:02 to 18:29:29 UTC) on 21 August 2026.
   - Only two representatives placed all 20 calls: **Arun** (12 calls) and **Leela** (8 calls). Zero background calls were placed by Dev, Kiran, Meera, or Ravi.
   - Durations ranged strictly from **3 seconds to 31 seconds** (minimum 3s on B07 and B20, maximum 31s on B18, with B11 lasting 26s).
   - Upstream observed outcomes: 15 were machine `voicemail` drops, and 5 were `unresponsive` drops (B01, B04, B07, B10, B14).
   - Inbound vs. Outbound: Calls B02, B06, and B11 were inbound carrier screening callbacks, while the remaining 17 were outbound dials.
   - **Frontline Takeaway**: This pattern confirms an automated end-of-day power-dialer campaign or carrier routing sweep. Isolating these 20 calls explains the 36.7% aggregate connect rate and prevents skewing individual rep productivity metrics.

### Upstream Telemetry Discrepancy Findings

1. **Phantom Follow-up on Departed Contact (Call C10 - Meadowbrick)**:
   - Upstream CRM metadata tagged `observed_outcome: follow_up`.
   - Spoken dialogue proves contact Aniket explicitly left Meadowbrick and declined follow-up (*"I don't work there anymore... No. I said I will contact you if there is anything to discuss"*).
   - The engine flags an Outcome Discrepancy, prevents automated outreach, and prompts account re-qualification.

2. **Customer Defect Escalation (Meeting M07 - Willowfield Trust)**:
   - Received in update delivery Revision 2 with 27 conversational turns.
   - Screen-share reveals 4 distinct UI and payment bugs (event payment description save reversion, recreate payment attachment failure, stuck reimbursement processing, and mark as paid amount retention).
   - The engine updates transcript contents while strictly preserving the manager's manual routing override.

3. **Rep Telephony Attribution Mismatch (Call C06)**:
   - CRM recorded representative name as Meera.
   - Spoken voice is Ravi (*"Good evening. Ravi here. I'll say at the start that this is a cold call"*).
   - The engine flags an Attribution Conflict chip to prevent misallocated sales coaching.

4. **Restricted Referral Governance (Call C09)**:
   - Upstream metadata marked outcome as `referred`.
   - Spoken dialogue proves contact Vedant explicitly prohibited using his name (*"No, please don't use my name"*).
   - The engine flags a governance warning ensuring outreach to business head Mr. Rishabh proceeds independently on cold merits.

### Deliberately Rejected Decision

- **Entity Merging of Related Meetings (Meeting M04 & M13 - Cedarwave Distribution)**:
  Meeting M04 (*Cedarwave Distribution / SpendNest discussion*, 09:00–09:30 UTC, organizer `team09@example.com`, status `recorded`, 25 turns) and Meeting M13 (*SpendNest <> Cedarwave Distribution - Migration discussion*, 08:30–09:30 UTC, organizer `team09@example.com`, status `not_scheduled`) involve the same client account (*Cedarwave Distribution*), share the exact same organizer (`team09@example.com`), and have overlapping calendar windows (`08:30–09:30 UTC` vs `09:00–09:30 UTC`).
  Under the Data Dictionary rules, an engine is permitted to suggest a proposed association with visible uncertainty between two related records.
  However, we deliberately **rejected** collapsing or heuristically merging M13 into M04's record entity for three reasons:
  1. **Strict Contract Identity**: The data contract mandates that `(source_type, source_id)` is the sole immutable record identity. Merging calendar records across different source IDs violates the ingestion contract boundary.
  2. **Preserving Unscheduled Booking Telemetry**: M13's recording status is `not_scheduled` (*"No notetaker was ever scheduled for this meeting"*). Collapsing M13 into M04 would silently erase this calendar coordination anomaly.
  3. **Honest Uncertainty Audit**: Instead of concealing M13 inside M04, we maintain separate intake auditability: M04 is routed to `customer_success` and `deal_next_steps` with 25 turns of verified dialogue, while M13 is retained in `intake_exceptions` with honest uncertainty noting its shared organizer and overlapping time with M04.

- **Collapsing 20 Voicemail Drops (B01–B20) into a Single Aggregate Summary**:
  We also considered grouping all background unreached calls into an aggregate summary card. We rejected this because a frontline manager needs to see individual dial durations (e.g. 3s vs 31s), rep attribution (Arun vs Leela), and carrier response codes to audit dialer cadence and data ops lead quality. Instead, we sorted the inbox so high-priority meetings (M01–M14) and evaluated conversations (C01–C10) appear first, while background screening drops sit at the bottom.

---

## 8. Runtime Architecture & AI Usage Disclosure

Per the submission brief (*"Pre-generated analysis is allowed. If you use it, make clear which content is pre-generated, what the application actually computes, and how new content is handled"*), the division of responsibilities is disclosed with total transparency:

- **What Is Pre-generated (Curated Prior to Runtime)**:
  - The substantive qualitative dossiers (headlines, synthesis, citations, honest uncertainties, and next steps) for the 18 active conversations were prepared with AI assistance from verbatim transcript texts and stored deterministically in `server/src/analysis/dossiers.ts` keyed by `record_ref`.
  - Multi-route conversations (e.g. M03, C04, C09, M09) receive tailored, route-differentiated dossiers rather than byte-identical duplicates: M03 outputs a commercial proposal dossier for `deal_next_steps` and a pricing transparency coaching dossier for `sales_coaching`.
  - Every citation was verified directly against `CONVERSATIONS.md` turns and quotes. Citing turns for phone calls is strictly forbidden by schema; phone calls cite verbatim quote snippets.
  - Owners and dates are set strictly when explicitly stated in dialogue; unassigned steps have `owner: null` and `timing: null` per the Data Contract specification.

- **What the Application Actually Computes at Runtime**:
  - **Identity Resolution & Deduplication**: Indexes records strictly by composite identity `(source_type, source_id)`, guaranteeing zero duplicate records regardless of import order.
  - **Telemetry Computation**: Computes `has_usable_text`, `text_length_chars`, and `speaker_count_computed` from raw payload envelopes at ingestion time.
  - **Filter-Reactive Metrics Engine**: Recalculates all KPI cards, coverage rates, and denominators dynamically for the active filter slice (e.g. filtering to Meetings recalculates metrics for the 14 meetings rather than displaying static global numbers).
  - **Hourly Activity Distribution**: Dynamically buckets interaction timestamps into Asia/Kolkata working hours (09:00–23:00 IST), rendering a stacked calls vs meetings timeline.
  - **Revision Ordering & State Machine**: Ingests higher revisions, rejects older/same revisions, updates suggested routes, marks `analysis_freshness` as `stale_pending_re-review`, and preserves user manual route corrections.
  - **Differentiated Multi-Destination Exports**: Formats distinct Markdown files tailored to each destination category (`sales_coaching`, `deal_next_steps`, `customer_support`, `customer_success`, `partnerships`, `internal_ops`, `intake_exception`) and emits machine-readable `manifest.json` and `manifest.csv`.

---

## 9. Approximate Time Spent & Engineering Context

- **Total Time Spent**: Approximately 8.5 hours total.
  - *Phase 1 (Pre-commit / ~3.5 hours)*: In-depth reading of `ASSIGNMENT.md`, `DATA_CONTRACT.md`, and raw source data; manual fact-checking of conversation transcripts; contract architecture design; and formulating the routing taxonomy.
  - *Phase 2 (Implementation & Refinement / ~5 hours)*: Test-driven backend development (Vitest unit and integration suites), idempotent ingestion engine, React frontend with Tailwind and Lucide icons, Playwright E2E browser tests, Docker containerization, and granular factual citation verification.
- **Known Limitations**:
  - Single-Date Horizon: All 44 interactions occur on Friday, August 21, 2026. Multi-week historical trend forecasting is not possible because the dataset represents a single operational day.
  - Telephony Waveforms: Audio waveforms were not supplied; telephony duration and IVR behavior are evaluated from upstream headers and transcript text.
- **Next Steps & Roadmap**:
  - Bi-directional webhook connector for CRM systems.
  - Native SQLite persistence adapter for high-throughput enterprise deployments.
  - Real-time audio stream transcription pipeline.

---

## 10. Output Structure & Manifests

Physical dossiers and manifests are generated in the `/exports` directory:

```
exports/
├── daily_briefs/
│   └── 2026-08-21_Asia_Kolkata_Manager_Daily_Brief.md
├── customer_success/
│   └── M04_Cedarwave_Distribution__SpendNest_d.md
├── customer_support/
│   └── M07_Willowfield_Trust__SpendNest_discus.md
├── deal_next_steps/
│   ├── C03_Kiran_20d509ba.md
│   └── M03_Asterloom_Systems__SpendNest_discus.md
├── intake_exceptions/
├── internal_ops/
│   ├── M02_LedgerBridge__SpendNest_discussion.md
│   └── M10_Billing_workflow_walkthrough.md
├── partnerships/
│   ├── C07_Dev_428817fa.md
│   └── M01_Harborpath_Advisory__SpendNest_disc.md
├── sales_coaching/
│   ├── C01_Arun_2ec4404c.md
│   └── C06_Meera_12216d5c.md
├── manifest.csv
└── manifest.json
```

- When an interaction serves multiple business functions (e.g. M03 involves both Deal Next Steps and Sales Coaching), distinct, tailored dossiers are written to both respective destination folders.
- `manifest.json` contains a top-level `export_metadata` block (including the relative path to the Manager Daily Brief) and strictly 44 source record items in `records`.
- `manifest.csv` strictly contains 44 rows (plus header), exactly one per source record.
- All file paths inside `manifest.json` and `manifest.csv` are relative to the export root directory.
