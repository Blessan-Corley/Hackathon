# SpendNest Revenue Intelligence Inbox — Five Presentation Slides
**Candidate Submission Deck (5 Slides)**

---

## Slide 1: The Manager Problem & Main Forensic Findings

### The Problem
Sales managers are flooded with incoming telephony logs, recorded meetings, and automated tags from disparate tools. But **upstream CRM tags do not reflect spoken reality**:
- Automated outcomes label departed, hostile contacts as *"follow_ups"*.
- Call recordings attribute conversations to the wrong representatives.
- Internal staff trainings and vendor sales pitches contaminate the sales pipeline.

### Three Critical Findings Linked to Source Evidence
1. **The Phantom Follow-up on Departed Contact (Call C10)**
   - *Source Passage:* Call C10 (`b747f592-810e-583c-9b81-8db5ab035806`), Quote:
     > *"Are you calling about Meadowbrick? Yes, that's right. I don't work there anymore... Would a follow-up call on Monday or Tuesday next week be okay... ? No. I said I will contact you if there is anything to discuss."*
   - *Product Impact:* Upstream tagged this call `observed_outcome: follow_up`. Our engine flags a **Discrepancy Warning Chip**, routes the contact to *Lost Contact*, and cancels all scheduled outreach to prevent rep harassment.
2. **Critical Product Bug Escalated in Update Batch (Meeting M07)**
   - *Source Passage:* Meeting M07 (`4f304fff-fd40-5cfc-a366-0a134c445c2a`), Turn 2:
     > Customer A screen-shares reproducing a software bug: editing an event-payment description reverts to the old wording upon saving.
   - *Product Impact:* Arriving in delivery `update-002` (Revision 2), the system refreshes analysis, preserves any existing manual manager override, and immediately routes the ticket to *Customer Support & Issue Escalation*.
3. **Telephony Rep Attribution Mismatch (Call C06)**
   - *Source Passage:* Call C06 (`12216d5c-e254-52c6-b344-47de4c6e1ae5`), Quote:
     > *"Good evening. Ravi here. I'll say at the start that this is a cold call."*
   - *Product Impact:* Telephony metadata logged `rep_name: Meera`, but caller is Ravi. System displays a **Caller Mismatch Badge** so management does not coach Meera for Ravi's pitch.

---

## Slide 2: Interface Architecture & Deliberate Omissions

### Design Philosophy: High-Density Executive Terminal (Zero AI Slop)
- **Scannable Triage Inbox:** Monospaced record refs (`C10`, `M07`), immediate discrepancy warning badges, and active route destinations.
- **Deep Evidence Inspector (Split-Pane Drawer):** Tabbed views for *Analysis & Intelligence*, *Verbatim Transcript with Turn Numbers*, and *Routing & Governance*.
- **1-Click Evaluation Replay Stepper:** Prominently placed at the top of the interface so evaluators can execute the 5-step data contract verification in 15 seconds.

### Deliberate Omissions (What We Left Out & Why)
- **Omitted 1: Vanity Charts & Sentiment Gauges.**
  - *Reason:* Circular pie charts and color-coded "sentiment scores" provide zero actionable insight to a sales manager. Replaced with actionable triage tables and verbatim quotes.
- **Omitted 2: Synthetic Pipeline ARR Sizing & Win Probability.**
  - *Reason:* No CRM opportunity table or deal size exists in the extract. Inventing revenue numbers from dialogue violates data integrity and creates managerial hallucination.
- **Omitted 3: Global Single Date Filtering.**
  - *Reason:* All 44 records occur on 21 August 2026 (Asia/Kolkata). A date filter alone is meaningless; we implemented a two-tier Person Filter separating Call Reps from Meeting Organizers.

---

## Slide 3: Routing Architecture & One Difficult Case

### 6-Tier Routing Taxonomy
1. **Deal Next Steps:** Qualified prospects with verified buying signals (e.g., M03 Asterloom CFO review, C03 Milan API webhooks).
2. **Sales Coaching:** Cold outreach pitch coaching, objection handling, and attribution corrections (e.g., C01 Arun, C06 Ravi).
3. **Customer Success:** Account health, feature adoption, and card migration (e.g., M04 Cedarwave fuel card decline).
4. **Customer Support:** Technical troubleshooting, bug reports, and onboarding defects (e.g., M07 description bug, M09 invitation failure).
5. **Partnerships:** Overseas corporate incorporation and virtual account referral channels (e.g., M01 Harborpath, C07 Willowbank).
6. **Internal Operations:** Internal training and vendor supplier evaluations (e.g., M10 staff billing walkthrough, M02 LedgerBridge e-invoicing).
7. **Intake Exceptions:** Unattended telephony and silent recordings (B01-B20, M05, M08, M11-M14).

### The Difficult Case: Meeting M07 (Willowfield Trust)
- **The Challenge:** M07 arrived in initial delivery `01_initial.json` with `recording_status: recorded`, `has_transcript: true`, but `turns: []` and reason: *"Transcript not included in this delivery; a later assessment batch supplies it."*
- **Handling Strategy:**
  1. In Revision 1, staged as an intake exception awaiting transcript.
  2. Evaluator manually routes M07 to `customer_support`.
  3. When `02_update.json` arrives with Revision 2 (27 turns detailing the payment description bug), the engine replaces source payloads, updates analysis, but **preserves the manual override**.
  4. Flags analysis freshness as `stale_pending_re-review` so the manager is notified that newer evidence has arrived.

---

## Slide 4: Metric Verification & Evidence Traceability

### Verification of Key Headline Metrics

| Metric | Formula & Explicit Denominator | Value | Integrity Note |
| :--- | :--- | :--- | :--- |
| **Total Selected Records** | Count of distinct `(source_type, source_id)` tuples | **44** | 30 calls + 14 meetings; order-independent. |
| **Usable Transcript Coverage** | Non-empty text / Total Selected Records (44) | **38.6% &rarr; 40.9%** | Increases from 17/44 to 18/44 when M07 arrives. |
| **Call Transcript Coverage** | Calls with transcript / Total Calls (30) | **33.3%** (10 / 30) | 20 background calls lack supplied audio. |
| **Meeting Transcript Coverage** | Meetings with turns / Total Meetings (14) | **50.0% &rarr; 57.1%** | Increases from 7/14 to 8/14 post-update. |
| **Source Telephony Connect Rate** | `is_connected=true` / Non-null calls (30) | **36.7%** (11 / 30) | Upstream telemetry only: B11 & B14 silent; C04 voicemail. |

### Evidence Traceability
- Every claim in the interface cites either:
  - **Meeting Turn Number:** e.g., M03 Turn 36 (Customer B: *"Send the details first. We need time with the CFO..."*).
  - **Call Exact Quote:** e.g., C09 (Vedant: *"No, please don't use my name."*).
- Clicking any citation in the Evidence Inspector jumps to and highlights the supporting turn or verbatim passage.

---

## Slide 5: Trade-offs, AI Usage, Limitations & Future Roadmap

### The Deliberately Rejected Decision
- **The Alternative Considered:** Generating automated deal valuations (e.g. "$50,000 ARR") and predictive win probability gauges using an LLM.
- **Why Deliberately Rejected:** No CRM revenue master tables or historical win rates exist in the extract. Guessing deal amounts creates false confidence and misleads sales leaders.
- **Accepted Trade-off:** Restricting pipeline intelligence to verifiable qualitative signals: stated next steps, named owners, and competitor identification (StoreHarbor in C05).

### AI Usage & Transparency
- **Deterministic & Rule-Based Core:** Ingestion idempotency, revision control, and metric calculations run 100% deterministically with zero hallucinations.
- **Pre-generated Intelligence Cache:** Analysis dossiers for all 18 transcripts are pre-computed with exact turn citations and embedded into the application, ensuring offline reproducibility without requiring paid API keys.
- **Extensible LLM Adapter:** Optional hooks provided for live model evaluation if configured by the user.

### Known Limitations & Next Steps
1. **Cross-Meeting Speaker Resolution:** Local labels like `Team member A` or `Customer A` are scoped to individual meetings; future work would link participants via email domains.
2. **Automated Follow-up Sync:** Connect verified next steps directly into calendar and task management systems (Google Workspace / Slack).
3. **Multi-Tenant Voice Analytics:** Expand to multi-day time series tracking rep coaching velocity across pipeline quarters.
