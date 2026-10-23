# SpendNest Revenue Intelligence Inbox

A revenue intelligence triage workspace and idempotent data contract engine designed for frontline sales managers. The platform reconciles CRM activity telemetry across phone calls and meetings, surfaces upstream data discrepancies, preserves human overrides through asynchronous batch updates, and routes conversational intelligence to downstream departments.

---

## 1. System Architecture

The project is structured as a monorepo containing a TypeScript backend engine and a modern React frontend:

- **Backend (`server/`)**: Built with Node.js, Express, and TypeScript. Implements composite identity indexing, idempotent upserting, revision tracking, mathematical metric calculations, multi-destination Markdown dossier generation, and a verification audit engine.
- **Frontend (`client/`)**: Built with React 19, TypeScript, Vite, and Tailwind CSS. Provides a triage inbox, metric dashboards, filter toolbar with custom semantic color indicators, an evidence inspector drawer with turn-by-turn citations, and an interactive data replay drawer.
- **Data Source (`candidate/`)**: Contains original CRM call and meeting payloads (`01_initial.json` and `02_update.json`).
- **Exports (`exports/`)**: Multi-destination dossier folders, `manifest.json`, and RFC 4180 compliant `manifest.csv`.

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
- Override preservation: user route edits survive upstream payload refreshes.
- Metric calculations: verifying explicit denominators and activity distributions.
- Multi-destination export generation and manifest emission.

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
| **3. Manual Correction** | Reassign M07 route (`PATCH /api/records/meeting/:id/route`) | Overrides M07 route to Customer Support with audit timestamp and manager justification note. |
| **4. Ingest Update** | Ingest `02_update.json` (`POST /api/replay/update`) | M07 updated to Revision 2 with 27 dialogue turns. Total records remains 44. Manual route override to Customer Support is strictly preserved. |
| **5. Test No-Downgrade** | Re-ingest `01_initial.json` (`POST /api/replay/repeat-initial`) | Incoming Revision 1 payload is rejected because Revision 2 is already active. M07 text and turns are retained. |

These steps can be executed individually from the UI via the **Sync & Replay Feeds** drawer, or verified automatically by clicking **Run 5-Step Evaluation Suite**.

---

## 6. Metric Definitions & Denominators

All dashboard KPIs are computed with mathematically defined numerators and denominators:

- **Total Records (44)**: Total unique `(source_type, source_id)` entities in the dataset (30 calls, 14 meetings).
- **Transcript Coverage (40.9% post-update)**: Numerator = 18 records with verified conversational text (10 calls, 8 meetings). Denominator = 44 total records.
- **Call Coverage (33.3%)**: Numerator = 10 calls with transcript text. Denominator = 30 total calls.
- **Meeting Coverage (57.1% post-update)**: Numerator = 8 meetings with turns. Denominator = 14 total meetings.
- **Source Telephony Connect Rate (36.7%)**: Numerator = 11 calls flagged `is_connected: true`. Denominator = 30 calls evaluated.
  *Note:* Upstream telephony telemetry reflects carrier signaling: calls B11 and B14 report `is_connected: true` despite being dropped 0s-9s dials, while call C04 reports `is_connected: false` with 95s IVR duration because Arun recorded a voicemail through screening rather than reaching a live prospect (standard telephony protocol).

---

## 7. Key Findings & Intentional Decisions

### Telemetry Findings

1. **Phantom Follow-up on Departed Contact (Call C10)**:
   - Upstream CRM metadata tagged `observed_outcome: follow_up`.
   - Spoken dialogue proves contact Aniket explicitly left Meadowbrick and declined follow-up (*"I don't work there anymore... No. I said I will contact you if there is anything to discuss"*).
   - The engine flags an Outcome Discrepancy, prevents automated outreach, and prompts account re-qualification.

2. **Customer Defect Escalation (Meeting M07)**:
   - Received in update delivery Revision 2 with 27 conversational turns.
   - Screen-share reveals an event-payment description persistence bug.
   - The engine updates transcript contents while preserving prior manual routing to Customer Support and Engineering SLA queues.

3. **Rep Telephony Attribution Mismatch (Call C06)**:
   - CRM recorded representative name as Meera.
   - Spoken voice is Ravi (*"Good evening. Ravi here. I'll say at the start that this is a cold call"*).
   - The engine flags an Attribution Conflict chip to prevent misallocated sales coaching.

4. **Internal and Vendor Separation**:
   - Meeting M10 is an internal staff training session on subscription billing.
   - Meeting M02 is a vendor pitch from LedgerBridge for e-invoicing API integration.
   - Both are routed to Internal Operations and excluded from sales pipeline quotas.

### Deliberately Rejected Decision

- **Entity Merging of Matching Titles (Meeting M04 & M13 - Cedarwave Distribution)**:
  We considered automatically collapsing M04 and M13 into a single unified account record because both share the exact calendar title *"Cedarwave Distribution / SpendNest discussion"*. However, we deliberately **rejected** heuristic entity merging for three reasons:
  1. **Strict Contract Identity**: The data contract mandates that `(source_type, source_id)` is the sole immutable record identity. Merging on title strings violates the contract boundary.
  2. **Different Telemetry & Stakeholders**: M04 was organized by `team09@example.com` (09:00 UTC) with 27 usable dialogue turns on corporate credit card migration. M13 was organized by `team06@example.com` (07:30 UTC) with recording status `organizer_only` (unattended). Collapsing them would silently erase the unattended meeting exception.
  3. **Data Loss Trade-off**: Treating separate calendar invites as one record corrupts individual meeting audit trails. We chose to retain M13 in the `intake_exceptions` triage queue with honest uncertainty, while independently routing M04 to `customer_success` and `deal_next_steps`.

- **Collapsing 20 Voicemail Drops (B01–B20) into a Single Row**:
  We also considered grouping all background unreached calls into an aggregate summary card. We rejected this because a frontline manager needs to see individual dial durations (e.g. 7s vs 24s), rep attribution, and carrier response codes to audit rep calling patterns and data ops lead quality. Instead, we sorted the inbox so high-priority meetings (M01–M14) and evaluated conversations (C01–C10) appear first, while background screening drops sit at the bottom.

---

## 8. Runtime Architecture & AI Usage Disclosure

Per the submission brief (*"Pre-generated analysis is allowed. If you use it, make clear which content is pre-generated, what the application actually computes, and how new content is handled"*), the division of responsibilities is disclosed with total transparency:

- **What Is Pre-generated (Curated Prior to Runtime)**:
  - The substantive qualitative dossiers (headlines, synthesis, citations, honest uncertainties, and next steps) for the 18 active conversations were prepared with AI assistance from verbatim transcript texts and stored deterministically in `server/src/analysis/dossiers.ts` keyed by `record_ref`.
  - This ensures 100% reproducible evaluations, zero invented claims or hallucinated quotes, and instantaneous offline execution without requiring third-party API keys or incurring LLM token latency.
  - Every citation was verified directly against `CONVERSATIONS.md` turns and quotes.

- **What the Application Actually Computes at Runtime**:
  - **Identity Resolution & Deduplication**: Indexes records strictly by composite identity `(source_type, source_id)`, guaranteeing zero duplicate records regardless of import order.
  - **Telemetry Computation**: Computes `has_usable_text`, `text_length_chars`, and `speaker_count_computed` from raw payload envelopes at ingestion time.
  - **Filter-Reactive Metrics Engine**: Recalculates all KPI cards, coverage rates, and denominators dynamically for the active filter slice (e.g. filtering to Meetings recalculates metrics for the 14 meetings rather than displaying static global numbers).
  - **Hourly Activity Distribution**: Dynamically buckets interaction timestamps into Asia/Kolkata working hours (09:00–23:00 IST), rendering a stacked calls vs meetings timeline.
  - **Revision Ordering & State Machine**: Ingests higher revisions, rejects older/same revisions, updates suggested routes (e.g. M07 updates from `intake_exception` to `customer_support`), marks `analysis_freshness` as `stale_pending_re-review`, and preserves user manual route corrections.
  - **Differentiated Multi-Destination Exports**: Formats distinct Markdown files tailored to each destination category (`sales_coaching`, `deal_next_steps`, `customer_support`, `customer_success`, `partnerships`, `internal_ops`, `intake_exception`) and emits machine-readable `manifest.json` and `manifest.csv`.

---

## 9. Approximate Time Spent & Engineering Context

- **Total Time Spent**: Approximately 7.5 hours total.
  - *Phase 1 (Pre-commit / ~3.5 hours)*: In-depth reading of `ASSIGNMENT.md`, `DATA_CONTRACT.md`, and raw source data; manual fact-checking of conversation transcripts; contract architecture design; and formulating the routing taxonomy.
  - *Phase 2 (Implementation / ~4 hours)*: Test-driven backend development (Vitest unit and integration suites), idempotent ingestion engine, React frontend with Tailwind and Lucide icons, Playwright E2E browser tests, and Docker containerization.
- **Known Limitations**:
  - Single-Date Horizon: All 44 interactions occur on Friday, August 21, 2026. Multi-week historical trend forecasting is not possible because the dataset represents a single operational day.
  - Telephony Waveforms: Audio waveforms were not supplied; telephony duration and IVR behavior are evaluated from upstream headers and transcript text.
- **Next Steps & Roadmap**:
  - Bi-directional webhook connector for HubSpot, Salesforce, and Gong.
  - Native SQLite persistence adapter for high-throughput enterprise deployments.
  - Automatic audio waveform transcription pipeline for real-time telephony streams.

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

- When an interaction serves multiple business functions (e.g. M03 involves both Deal Next Steps and Sales Coaching), distinct dossiers are written to both respective destination folders.
- All file paths inside `manifest.json` and `manifest.csv` are relative to the export root directory.
