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
  *Note:* Upstream telephony flags exhibit telemetry discrepancies: calls B11 and B14 report `is_connected: true` despite zero prospect response, while call C04 reports `is_connected: false` despite rep Arun speaking for 95 seconds.

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

- **Automated Deal Sizing ($ ARR) and Win Probability**:
  The decision to generate artificial currency amounts or probability percentages was considered and rejected. The dataset provides zero historical CRM revenue stages, average selling prices, or contract histories. Inventing financial figures from cold call dialogue compromises data integrity. The application instead captures verifiable qualitative signals: stated next steps, named decision-makers, and competitor evaluations.

---

## 8. Runtime Architecture & AI Usage Disclosure

Per the submission guidelines, the division between dynamic operations and pre-computed content is transparently defined:

- **Dynamic Operations (Computed at Runtime)**:
  - Composite identity resolution `(source_type, source_id)` and idempotent batch deduplication.
  - Multi-revision replacement (applying higher revision payloads, rejecting older revisions).
  - Manual override state preservation and manager review lifecycle transitions (`unreviewed` -> `reviewed` -> `pending_re-review`).
  - Mathematical KPI calculations (denominators, channel breakdowns, connect rates, anomaly counts).
  - Search filtering, multi-attribute indexing, and client-side view state routing.
  - Disk exports and real-time generation of `manifest.json`, `manifest.csv`, and category dossier files.

- **Pre-computed Content**:
  - Initial conversational analyses, citations, and next-step actions were structured deterministically from verbatim transcript evidence to ensure 100% reproducibility without third-party API keys, subscription rate limits, or non-deterministic model drift.
  - When new transcripts arrive dynamically (such as M07 v2), the system surfaces the updated evidence, transitions the review state to `pending_re-review`, and preserves prior human overrides.

---

## 9. Approximate Time Spent & Limitations

- **Approximate Engineering Time**: 7.5 hours across architecture design, test pyramid implementation, full-spectrum E2E testing, and luxury UI/UX polish.
- **Known Limitations**:
  - Single-Date Horizon: All 44 supplied interactions occur on Friday, August 21, 2026 (Asia/Kolkata). Multi-week historical trend analysis is not modeled because the dataset intentionally represents a single operational day.
  - Upstream Telephony Audio: Telephone audio waveforms are not supplied; transcript text is evaluated as provided in the raw payload. Acoustic tone or sentiment analysis is not inferred beyond verbatim text.
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
