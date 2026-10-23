# SpendNest Revenue Intelligence Inbox

A revenue intelligence triage workspace and idempotent decision engine built to help sales managers review calls and meetings, catch dirty telemetry, resolve multi-purpose routing, and preserve human overrides across asynchronous data deliveries.

---

## 1. Quick Start & Execution

### Prerequisites
- Node.js (v18+ or v22+)
- npm (v9+)

### Installation & Run
To run the complete application (both API backend and Vite client served simultaneously):

```bash
# 1. Install dependencies for server and client
npm --prefix server install
npm --prefix client install

# 2. Build production artifacts
npm run build

# 3. Start the unified production server
npm start
```

The application opens at **`http://localhost:4000`**.

> **Note on Deployed URL:** If reviewing via the hosted deployment, open the provided deployment link directly in any modern browser. Access is enabled without requiring sign-in or authorization.

---

## 2. Test Pyramid & Terminal Verification

This project adheres to a **Mandatory Full-Spectrum Testing Culture (Zero Untested Code Policy)** across all 3 tiers:

### Tier 1 & Tier 2: Unit & Integration Test Suite (Vitest)
Executes all ingestion contract rules, idempotency assertions, metric calculations, and REST replay lifecycles:

```bash
npm test
```
*Output: 15 passed across 4 test suites (Ingestion, Metrics, Export, Replay REST).*

### Tier 3: End-to-End Browser Test Suite (Playwright)
Executes real browser workflows, DOM interactions, inspector drawers, and 1-click evaluation steppers:

```bash
npm run test:e2e
```
*Output: 6 passed (All UI workflows, filter state, and contract checks verified).*

---

## 3. How to Reproduce the 5 Replay Checks

The application includes an **interactive Replay Stepper** directly in the UI header. You can execute each step manually or click **"Run 5-Step Evaluation Suite"** to verify the entire contract automatically in 1 second.

| Step | Action in UI or API | Expected & Verified Behaviour |
| :--- | :--- | :--- |
| **1. Initial Import** | Click **"1. Initial"** (`POST /api/replay/initial`) | Ingests `01_initial.json`. Exactly 44 records loaded. 17 usable transcripts. M07 staged in intake with 0 turns. |
| **2. Repeat Import** | Click **"2. Re-import (Shuffled)"** (`POST /api/replay/repeat-initial`) | Re-ingests initial batch with array order randomized. **0 duplicates added**; total count remains 44. |
| **3. Manual Correction** | Click **"3. Override M07"** or change route in drawer (`PATCH /api/records/meeting/:id/route`) | Overrides M07 route to `Customer Support`. Stored as `is_manually_corrected: true` with manager justification. |
| **4. Update Batch** | Click **"4. Update (Rev 2)"** (`POST /api/replay/update`) | Ingests `02_update.json`. M07 updated to Revision 2 with 27 turns. Total records stays 44. **Manual override to Customer Support is preserved**. |
| **5. No Downgrade** | Click **"5. Test No-Downgrade"** (`POST /api/replay/repeat-initial`) | Ingests Revision 1 again. The engine ignores older revision; M07 remains Revision 2. |

---

## 4. Where Generated Exports & Manifests are Located

When exports are generated (via `POST /api/export/generate` or clicking **"Exports & Manifest"** in the app):

- **Physical Output Folder:** `/exports` in the project root.
- **Machine-Readable Manifests:**
  - `/exports/manifest.json` (Structured JSON)
  - `/exports/manifest.csv` (RFC 4180 CSV with escaped fields)
- **Shared Manager Brief:** `/exports/daily_briefs/2026-08-21_Asia_Kolkata_Manager_Daily_Brief.md`
- **Dossiers by Destination:**
  - `/exports/deal_next_steps/` (e.g., `M03_Asterloom`, `C03_Milan`)
  - `/exports/sales_coaching/` (e.g., `C01_Arun`, `C06_Ravi`, `M03_Asterloom`)
  - `/exports/customer_success/` (e.g., `M04_Cedarwave`)
  - `/exports/customer_support/` (e.g., `M07_Willowfield`, `M09_Brookmint`)
  - `/exports/partnerships/` (e.g., `M01_Harborpath`, `C07_Willowbank`)
  - `/exports/internal_ops/` (e.g., `M10_BillingTraining`, `M02_LedgerBridge`)
  - `/exports/intake_exceptions/` (`M05`, `M08`, `M11`, `M12`, `M13`, `M14`, and background calls)

> **Multi-Destination Context:** When a conversation serves multiple goals (such as `M03` requiring both deal acceleration and pricing objection coaching), independent markdown dossiers are written to both destination directories without loss of history.

---

## 5. Metric Definitions & Explicit Denominators

| Headline Number | Exact Formula | Numerator | Explicit Denominator | Value |
| :--- | :--- | :--- | :--- | :--- |
| **Total Records** | Distinct `(source_type, source_id)` tuples | 44 | N/A | **44** |
| **Transcript Coverage** | Records with non-empty text / Total Records | 17 (init) &rarr; 18 (update) | 44 Total Extract Records | **38.6% &rarr; 40.9%** |
| **Call Coverage** | Calls with `payload.transcript` / Total Calls | 10 calls | 30 Total Calls | **33.3%** |
| **Meeting Coverage** | Meetings with turns / Total Meetings | 7 (init) &rarr; 8 (update) | 14 Total Meetings | **50.0% &rarr; 57.1%** |
| **Source Connect Rate** | Calls with `is_connected === true` / Calls with non-null `is_connected` | 11 calls | 30 Calls Evaluated | **36.7%** |

*Note on Telephony Discrepancies:* The Source Connect Rate measures upstream telephony flags only. Calls `B11` and `B14` report `is_connected: true` but are unresponsive (0 text), while Call `C04` reports `is_connected: false` despite rep Arun speaking a 95-second screening and voicemail script.

---

## 6. The Three Most Important Findings

1. **Phantom Follow-up on Departed Contact (Call C10)**
   - *Source Reference:* Call C10 (`b747f592-810e-583c-9b81-8db5ab035806`), Quote:
     > *"Are you calling about Meadowbrick? Yes, that's right. I don't work there anymore... Would a follow-up call on Monday or Tuesday next week be okay... ? No. I said I will contact you if there is anything to discuss."*
   - *Product Impact:* Upstream metadata marked `observed_outcome: follow_up`. Our engine flags a high-priority **Discrepancy Alert**, classifies the contact as departed, and cancels scheduled outreach.
2. **Customer Defect Escalation: Payment Description Persistence (Meeting M07)**
   - *Source Reference:* Meeting M07 (`4f304fff-fd40-5cfc-a366-0a134c445c2a`), Turn 2:
     > Customer A shares screen showing that editing payment description does not persist upon saving.
   - *Product Impact:* Arriving in update delivery Revision 2, the engine replaces source text, preserves any existing manual manager override, and flags the ticket for Engineering support escalation.
3. **Rep Attribution Mismatch in Telephony Metadata (Call C06)**
   - *Source Reference:* Call C06 (`12216d5c-e254-52c6-b344-47de4c6e1ae5`), Quote:
     > *"Good evening. Ravi here. I'll say at the start that this is a cold call."*
   - *Product Impact:* Upstream CRM claims caller is Meera, but spoken caller is Ravi. System flags a **Caller Attribution Mismatch** to prevent misdirected coaching.

---

## 7. The One Deliberately Rejected Decision

- **Rejected:** Automated Deal Value Sizing ($ ARR) & Win Probability Scoring.
- **Why Rejected:** The dataset contains zero CRM deal stages, company financial records, or contract terms. Inventing currency amounts or win probability percentages from conversational banter creates false managerial confidence and violates data contract integrity.
- **Accepted Trade-off:** Restricting deal intelligence to verifiable qualitative signals: stated next steps, named owners (e.g. Asterloom M03 Turn 36), and competitor identification (StoreHarbor C05).

---

## 8. AI Usage & Implementation Choices

- **Deterministic Ingestion & Idempotency:** The upsert engine, revision controller, manifest generator, and metric calculations run 100% deterministically.
- **Pre-generated Intelligence Cache:** Analysis dossiers for all 18 conversations and 26 telemetry records are pre-computed with exact turn and quote citations, ensuring immediate offline execution without requiring paid API keys or credentials.
- **Runtime Computations:** Dynamic filtering, manual route overrides, review state transitions, audit logging, and ZIP streaming execute dynamically in Node.js.

---

## 9. Submission Deliverables Summary

- **Working Application:** `http://localhost:4000` (Unified production build).
- **Five Slides:** Documented in [`docs/FIVE_SLIDES.md`](file:///F:/My%20Projects/Assesment/docs/FIVE_SLIDES.md).
- **Three-Minute Screen Recording Script:** Documented in [`docs/NARRATED_SCREEN_RECORDING_SCRIPT.md`](file:///F:/My%20Projects/Assesment/docs/NARRATED_SCREEN_RECORDING_SCRIPT.md).
- **Export Tree & Manifests:** Located in [`exports/`](file:///F:/My%20Projects/Assesment/exports/).
- **Approximate Time Spent:** 7.5 hours.
- **Known Limitations & Future Work:** Local meeting speaker tags (`Team member A`, `Customer A`) are scoped per meeting; future enhancements would join cross-meeting attendees via verified corporate email domains.
