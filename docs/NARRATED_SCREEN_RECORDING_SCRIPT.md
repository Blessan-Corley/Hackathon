# 3-Minute Spoken Narration Screen Recording Script

**Title:** SpendNest Revenue Intelligence Inbox Walkthrough & Contract Verification  
**Target Duration:** 3:00 (180 seconds)  
**Presenter:** Candidate  

---

### Phase 1: Overview & Useful Manager Workflow (0:00 – 1:00)

**[Visual Action 0:00 – 0:20]:**  
*Screen opens on the SpendNest Revenue Intelligence workspace at `http://localhost:4000`. Hover cursor over the headline metric cards.*

**[Spoken Narration]:**  
> *"Hello! Today I’m walking you through the SpendNest Revenue Intelligence Inbox, built to help sales managers triage incoming calls and meetings, catch dirty CRM telemetry, and protect rep time.*
>
> *Looking at our executive dashboard, all activity falls on **21 August 2026 in Asia/Kolkata**. Our headline metric shows **44 total records**—30 phone dials and 14 calendar meetings. Notice our **Transcript Coverage rate is 38.6%**, which represents 17 usable transcripts out of our 44 total records denominator. We strictly define every denominator so missing records are never obscured.*
>
> *We also separate Call Reps from Meeting Organizers in our filter bar, because an organizer like `arun@example.com` on calendar meeting M12 is not necessarily the same role as sales rep Arun placing cold calls."*

**[Visual Action 0:20 – 1:00]:**  
*Click on Call `C10` in the triage table. The Evidence Inspector drawer slides open from the right. Click on the Discrepancy Alert banner.*

**[Spoken Narration]:**  
> *"Now let me show you our first critical manager workflow: catching CRM metadata discrepancies before they burn customer goodwill.*
>
> *Here in our inbox, take a look at Call **C10**. Upstream telephony marked this call with `observed_outcome: follow_up`. But look at our Discrepancy Alert and the verbatim quote: rep Meera asks if she can follow up next Monday, and contact Aniket explicitly says: 'No. I said I will contact you if there is anything to discuss.' Furthermore, Aniket stated he left Meadowbrick entirely and moved to manufacturing.*
>
> *If an automated CRM blindly scheduled a follow-up task, Meera would harass a hostile contact who no longer works at the target account. Our engine automatically flags this discrepancy, prevents unauthorized outreach, and marks the record for Meadowbrick account re-prospecting."*

---

### Phase 2: A Difficult Routing Decision (1:00 – 1:45)

**[Visual Action 1:00 – 1:45]:**  
*Close C10. Click on Meeting `M03` (Asterloom Systems). Switch between Tab 1 (Analysis) and Tab 2 (Transcript), clicking on Turn 36 to demonstrate auto-highlighting.*

**[Spoken Narration]:**  
> *"Next, let’s examine a difficult routing decision: Meeting **M03** with Asterloom Systems.*
>
> *This conversation presents a multi-destination dilemma. On one hand, it’s a high-potential sales evaluation: Asterloom is evaluating SpendNest cards to replace slow domestic payroll reimbursement. But on the other hand, it requires intensive sales coaching on pricing resistance and gatekeeper management.*
>
> *In Turn 36, Customer B explicitly states: 'Send the details first. We need time with the CFO... Let us make that decision internally before scheduling anything.'*
>
> *If our system forced a single bucket, we would lose either the deal acceleration or the rep coaching. Therefore, our routing taxonomy assigns **M03 to both 'Deal Next Steps' and 'Sales Coaching'**. When we generate our exports, separate dossiers are populated in both `/deal_next_steps` and `/sales_coaching` directories, preserving complete context without data duplication."*

---

### Phase 3: The Duplicate & Update Replay Test (1:45 – 2:45)

**[Visual Action 1:45 – 2:05]:**  
*Scroll up to the top Replay Stepper. Click button '2. Re-import (Shuffled)'. Watch live toast confirm 0 duplicates.*

**[Spoken Narration]:**  
> *"Now let's demonstrate the core data contract and replay requirements: idempotency, manual override preservation, and late-arriving transcripts.*
>
> *First, the duplicate test. I click **'2. Re-import (Shuffled)'**. The engine re-ingests the entire initial batch with records reversed and randomized. As you can see on the screen, exactly **0 duplicates were added**, and our total record count remains strictly at 44.*
>
> *Record identity is keyed strictly by the tuple `(source_type, source_id)`, so array positions or titles never inflate activity numbers."*

**[Visual Action 2:05 – 2:25]:**  
*Click button '3. Override M07'. Then click on M07 in the table, showing manual route set to 'Customer Support'.*

**[Spoken Narration]:**  
> *"Next, let's test manual route preservation. Meeting **M07** arrived in the initial delivery without a transcript. I click **'3. Override M07'**, which manually assigns M07 to 'Customer Support' with a saved manager justification note."*

**[Visual Action 2:25 – 2:45]:**  
*Click button '4. Update (Rev 2)'. Then click button '5. Test No-Downgrade'. Open M07 inspector.*

**[Spoken Narration]:**  
> *"Now I click **'4. Update (Rev 2)'**, ingesting `02_update.json`. Notice three things happen instantly:*
> 1. *Total records remains exactly 44—it did not create a 45th phantom record.*
> 2. *M07’s transcript arrives with 27 verified turns detailing a customer payment description bug.*
> 3. *And crucially, **our manual route override to Customer Support survived completely intact**!*
>
> *Finally, I click **'5. Test No-Downgrade'**, re-ingesting revision 1. The engine ignores the older delivery, and M07 remains at Revision 2. You can also click **'Run 5-Step Evaluation Suite'** to verify all checks automatically in 1 second."*

---

### Phase 4: Conclusion & Export Inspection (2:45 – 3:00)

**[Visual Action 2:45 – 3:00]:**  
*Click 'Exports & Manifest' in the top header. Show the manifest table and hover over 'Download ZIP Archive'.*

**[Spoken Narration]:**  
> *"To wrap up: clicking **'Exports & Manifest'** displays our generated output directory with relative file paths for all 44 records, complete with a machine-readable `manifest.json` and `manifest.csv`. You can download the complete ZIP archive with one click.*
>
> *Thank you for reviewing SpendNest Revenue Intelligence!"*
