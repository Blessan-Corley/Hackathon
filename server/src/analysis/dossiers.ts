import { ConversationAnalysis, RouteCategory } from '../domain/types.js';

export const DOSSIERS: Record<string, {
  routes: RouteCategory[] | ((revision: number) => RouteCategory[]);
  analysis: (revision: number) => ConversationAnalysis;
}> = {
  // --- CALLS ---
  C01: {
    routes: ['sales_coaching'],
    analysis: () => ({
      headline: 'Cold Outreach Rejection - Prospect Cites Existing Automated Setup',
      what_happened: 'Rep Arun contacted Pranav at Harborlight Advisory regarding finance automation. Pranav questioned the unsolicited outreach ("I didn\'t ask for this call, and I\'m not interested. This number is for my work, not for people to sell things to me") and stated Harborlight already has advanced automated processes in place.',
      why_it_matters: 'Arun pitched general automation without qualifying whether the firm already had systems in place, meeting immediate resistance.',
      evidence_citations: [
        {
          id: 'c01-cite-1',
          type: 'quote',
          reference: 'Spoken Transcript',
          quote: "I don't know how I ended up on your list. I didn't ask for this call, and I'm not interested. This number is for my work, not for people to sell things to me... Our processes are already very automated. We have a fairly advanced setup, so I don't think this is something we need.",
          note: 'Prospect clarifies work number privacy and existing automated stack.'
        }
      ],
      what_evidence_does_not_establish: [
        'Does not establish which specific automation tools Harborlight Advisory uses.',
        'Does not establish whether Arun has contacted other partners at the firm.'
      ],
      next_steps: [
        {
          action: 'Sales coaching for Arun on qualifying prospect tech maturity before leading into generic automation pitches.',
          owner: 'Sales Manager',
          timing: 'Immediate',
          verifiable: true
        },
        {
          action: 'Tag Harborlight Advisory contact record as Not Interested / Existing Automated Solution.',
          owner: 'Arun',
          timing: '2026-08-21 EOD',
          verifiable: true
        }
      ],
      is_precomputed: true
    })
  },

  C02: {
    routes: ['deal_next_steps'],
    analysis: () => ({
      headline: 'Gatekeeper Interaction - Target Contact Out of Office',
      what_happened: 'Arun called Fernhaven Group requesting Leela. Receptionist Kavya informed him Leela is out of office. Arun left his callback details politely.',
      why_it_matters: 'Valid gatekeeper touchpoint; relationship maintained professionally without burning lead.',
      evidence_citations: [
        {
          id: 'c02-cite-1',
          type: 'quote',
          reference: 'Spoken Transcript',
          quote: "It looks as though she isn't in the office today. Can I take a message?",
          note: 'Gatekeeper confirms contact identity and accepts message.'
        }
      ],
      what_evidence_does_not_establish: [
        'Does not establish Leela\'s exact return date or purchasing authority.'
      ],
      next_steps: [
        {
          action: 'Follow-up call to Fernhaven Group next business week.',
          owner: 'Arun',
          timing: '2026-08-25',
          verifiable: true
        }
      ],
      is_precomputed: true
    })
  },

  C03: {
    routes: ['deal_next_steps'],
    analysis: () => ({
      headline: 'Technical API Evaluation - Budget Sensitivity & Monday Follow-up',
      what_happened: 'Rep Kiran reconnected with Milan regarding SpendNest developer API access and event webhooks. Milan noted prior price resistance, requested an email summary with a specific subject line, and agreed to speak Monday/Tuesday.',
      why_it_matters: 'Active evaluation with explicit follow-up instructions and agreed communication channel.',
      evidence_citations: [
        {
          id: 'c03-cite-1',
          type: 'quote',
          reference: 'Spoken Transcript',
          quote: 'When we last spoke, price was a concern... What subject should I look for? Something like "Developer access and event notifications — follow-up". Send the email and we can speak Monday or Tuesday.',
          note: 'Clear agreed next steps and subject line agreed by prospect Milan.'
        }
      ],
      what_evidence_does_not_establish: [
        'Does not establish developer team size or technical feasibility timeline.'
      ],
      next_steps: [
        {
          action: 'Send technical summary email with subject "Developer access and event notifications — follow-up".',
          owner: 'Kiran',
          timing: '2026-08-21 EOD',
          verifiable: true
        },
        {
          action: 'Schedule follow-up phone call for Monday morning.',
          owner: 'Kiran',
          timing: '2026-08-24 10:00 AM',
          verifiable: true
        }
      ],
      is_precomputed: true
    })
  },

  C04: {
    routes: ['deal_next_steps', 'sales_coaching'],
    analysis: () => ({
      headline: 'Detailed Follow-Up Voicemail Left After Email Delivery Correction',
      what_happened: 'Arun navigated an automated screening service and left a 95-second voicemail for Ritesh at Lanternpath Media following up on expense software collateral re-sent to a corrected email address.',
      why_it_matters: 'Active account re-engagement attempt following an earlier email delivery issue; rep clearly stated purpose and requested callback.',
      evidence_citations: [
        {
          id: 'c04-cite-1',
          type: 'quote',
          reference: 'Spoken Transcript',
          quote: "Arun from SpendNest here. I'm following up on your consideration of our expense platform for Lanternpath Media. My understanding is that our information first went to the wrong email address. We subsequently used the corrected address you gave us, and I hope you have now had a chance to see it.",
          note: 'Arun leaves detailed voicemail with context on corrected proposal email.'
        }
      ],
      what_evidence_does_not_establish: [
        'Does not establish whether Ritesh opened or reviewed the corrected email proposal.'
      ],
      next_steps: [
        {
          action: 'Monitor email open tracking for Lanternpath Media proposal.',
          owner: 'Arun',
          timing: '2026-08-22',
          verifiable: true
        }
      ],
      is_precomputed: true
    })
  },

  C05: {
    routes: ['deal_next_steps', 'sales_coaching'],
    analysis: () => ({
      headline: 'Competitive Encounter - StoreHarbor Incumbent Identified',
      what_happened: 'Rep Meera pitched multi-store expense management. Prospect revealed they already use StoreHarbor and other tools for vendor payments and store cards, but agreed to review SpendNest presentation collateral.',
      why_it_matters: 'Identifies primary market competitor (StoreHarbor) and secures email permission to send competitive battlecard.',
      evidence_citations: [
        {
          id: 'c05-cite-1',
          type: 'quote',
          reference: 'Spoken Transcript',
          quote: 'May I ask which platform you\'re using? There are several. One is StoreHarbor, and we use others too. What I suggest is that you send me your presentation.',
          note: 'Prospect names incumbent competitor StoreHarbor and gives email contact05@example.com.'
        }
      ],
      what_evidence_does_not_establish: [
        'Does not establish contract expiration date with StoreHarbor.'
      ],
      next_steps: [
        {
          action: 'Send comparative presentation highlighting SpendNest advantages over StoreHarbor to contact05@example.com.',
          owner: 'Meera',
          timing: '2026-08-21 EOD',
          verifiable: true
        }
      ],
      is_precomputed: true
    })
  },

  C06: {
    routes: ['sales_coaching'],
    analysis: () => ({
      headline: 'Cold Call to Retail Chain - Rep Identity Mismatch in Metadata',
      what_happened: 'Caller pitched store expense automation to Nikhil (120+ retail stores). Prospect stated existing ERP handles local branches with full head-office visibility. Spoken caller identifies himself as "Ravi", despite metadata attributing call to "Meera".',
      why_it_matters: 'Critical attribution error: coaching on this conversation must be directed to Ravi, not Meera.',
      evidence_citations: [
        {
          id: 'c06-cite-1',
          type: 'quote',
          reference: 'Spoken Transcript',
          quote: "Hello? Good evening, Mr Nikhil. Good evening. Ravi here. I'll say at the start that this is a cold call.",
          note: 'Spoken identity is clearly Ravi, conflicting with rep_name Meera in CRM payload.'
        }
      ],
      what_evidence_does_not_establish: [
        'Does not establish which ERP software Nikhil\'s 120-store chain uses.'
      ],
      discrepancy: {
        field: 'rep_name',
        upstream_claim: 'Meera',
        spoken_reality: 'Spoken introduction explicitly states: "Ravi here."',
        impact_explanation: 'Manager reviewing rep performance logs would attribute call metrics to the wrong representative.',
        severity: 'high'
      },
      next_steps: [
        {
          action: 'Correct telephony seat assignment for Ravi to prevent account misattribution.',
          owner: 'Sales Operations',
          timing: 'Immediate',
          verifiable: true
        }
      ],
      is_precomputed: true
    })
  },

  C07: {
    routes: ['partnerships'],
    analysis: () => ({
      headline: 'Channel Referral Partnership - Overseas Incorporation Advisory',
      what_happened: 'Rep Dev called Aditya at Willowbank Advisory regarding partner referrals. Aditya confirmed they incorporate companies overseas and refer clients for virtual business accounts. Aditya asked Dev to send proposal via chat app and follow up Monday.',
      why_it_matters: 'High-value channel partnership opportunity that could yield recurring client referrals for virtual accounts.',
      evidence_citations: [
        {
          id: 'c07-cite-1',
          type: 'quote',
          reference: 'Spoken Transcript',
          quote: "We'd like to partner with advisory firms such as yours so your clients can access a virtual business account after incorporation. Do you currently refer clients... ? Yes, that is something we normally do... send whatever proposal you have... call on Monday.",
          note: 'Aditya validates referral partner model and sets Monday follow-up.'
        }
      ],
      what_evidence_does_not_establish: [
        'Does not establish referral fee structure or commission expectations.'
      ],
      next_steps: [
        {
          action: 'Send partnership deck and referral agreement draft via messaging app.',
          owner: 'Dev',
          timing: '2026-08-21 EOD',
          verifiable: true
        },
        {
          action: 'Follow-up partnership review call on Monday.',
          owner: 'Dev',
          timing: '2026-08-24',
          verifiable: true
        }
      ],
      is_precomputed: true
    })
  },

  C08: {
    routes: ['deal_next_steps'],
    analysis: () => ({
      headline: 'Qualified Referral from Executive to People Operations Lead',
      what_happened: 'Meera introduced SpendNest to Raghav. Raghav indicated their people operations colleague handles frontline locations and expense solutions, provided direct email (contact08@example.com), and authorized Meera to state Raghav referred her.',
      why_it_matters: 'Clean, authorized internal executive referral with stated stakeholder contact.',
      evidence_citations: [
        {
          id: 'c08-cite-1',
          type: 'quote',
          reference: 'Spoken Transcript',
          quote: 'The colleague handling our people operations also deals with frontline processes and the locations... If you send him a proposal and say you spoke with me, he can take a look. contact08@example.com.',
          note: 'Raghav gives explicit authorization to use his name for intro.'
        }
      ],
      what_evidence_does_not_establish: [
        'Does not establish specific current pain point of people operations lead.'
      ],
      next_steps: [
        {
          action: 'Draft email to contact08@example.com referencing conversation with Raghav.',
          owner: 'Meera',
          timing: '2026-08-22 09:00 AM',
          verifiable: true
        }
      ],
      is_precomputed: true
    })
  },

  C09: {
    routes: ['sales_coaching', 'deal_next_steps'],
    analysis: () => ({
      headline: 'Restricted Referral - Name-Dropping Forbidden by Contact',
      what_happened: 'Meera called Vedant (130 store chain, in-house software). Vedant suggested reaching out to business head Mr. Rishabh on professional networks, but explicitly forbade using his name.',
      why_it_matters: 'Upstream metadata marked `observed_outcome: referred`. However, the referral has strict governance constraints: using Vedant\'s name will burn credibility.',
      evidence_citations: [
        {
          id: 'c09-cite-1',
          type: 'quote',
          reference: 'Spoken Transcript',
          quote: "Would it be all right if I mentioned your name when contacting him? No, please don't use my name.",
          note: 'Vedant strictly prohibits using his identity during outreach.'
        }
      ],
      what_evidence_does_not_establish: [
        'Does not establish Rishabh\'s direct email or phone number.'
      ],
      discrepancy: {
        field: 'observed_outcome',
        upstream_claim: 'referred',
        spoken_reality: 'Contact strictly forbade using his name ("No, please don\'t use my name").',
        impact_explanation: 'Treating this as an authorized warm referral would severely backfire upon cold outreach to Rishabh.',
        severity: 'high'
      },
      next_steps: [
        {
          action: 'Connect with Mr. Rishabh on professional networking site via cold value-add pitch (WITHOUT mentioning Vedant).',
          owner: 'Meera',
          timing: '2026-08-24',
          verifiable: true
        }
      ],
      is_precomputed: true
    })
  },

  C10: {
    routes: ['sales_coaching'],
    analysis: () => ({
      headline: 'Severe Metadata Contradiction - Contact Forbids Follow-Up and Left Company',
      what_happened: 'Meera called Aniket regarding Meadowbrick. Aniket stated he no longer works at Meadowbrick and has moved to manufacturing. When Meera asked to call next Monday/Tuesday, Aniket bluntly refused: "No. I said I will contact you if there is anything to discuss."',
      why_it_matters: 'Upstream system tagged `observed_outcome: follow_up`. Rep following this tag will harass a hostile contact who lacks authority and explicitly rejected outreach.',
      evidence_citations: [
        {
          id: 'c10-cite-1',
          type: 'quote',
          reference: 'Spoken Transcript',
          quote: 'Are you calling about Meadowbrick? Yes, that\'s right. I don\'t work there anymore... Would a follow-up call on Monday or Tuesday next week be okay... ? No. I said I will contact you if there is anything to discuss.',
          note: 'Explicit refusal of follow-up call and departure from target account.'
        }
      ],
      what_evidence_does_not_establish: [
        'Does not establish new decision maker at Meadowbrick.'
      ],
      discrepancy: {
        field: 'observed_outcome',
        upstream_claim: 'follow_up',
        spoken_reality: 'Contact left target firm and explicitly stated: "No. I said I will contact you if there is anything to discuss."',
        impact_explanation: 'High risk of sales rep harassment. Upstream AI or classifier completely inverted the contact\'s refusal.',
        severity: 'high'
      },
      next_steps: [
        {
          action: 'Cancel all scheduled follow-up tasks for Aniket.',
          owner: 'Meera',
          timing: 'Immediate',
          verifiable: true
        },
        {
          action: 'Re-prospect Meadowbrick account for new finance/procurement leadership.',
          owner: 'SDR Lead',
          timing: '2026-08-25',
          verifiable: true
        }
      ],
      is_precomputed: true
    })
  },

  // --- MEETINGS ---
  M01: {
    routes: ['partnerships'],
    analysis: () => ({
      headline: 'Harborpath Advisory - Channel Referral Scope Qualification',
      what_happened: 'Team Member A met with Partner A at Harborpath Advisory. Partner A explores SpendNest virtual business accounts for their corporate clients incorporating in remote jurisdictions. Boundary clarified: SpendNest only services registered corporate entities, not personal accounts.',
      why_it_matters: 'Establishes clear criteria for a recurring corporate formation partner channel.',
      evidence_citations: [
        {
          id: 'm01-cite-1',
          type: 'turn',
          turn_number: 2,
          speaker: 'Team member A',
          reference: 'Turn 2',
          note: 'Team member A establishes explicit compliance boundary: registered businesses only, no personal banking.'
        },
        {
          id: 'm01-cite-2',
          type: 'turn',
          turn_number: 28,
          speaker: 'Partner A',
          reference: 'Turn 28',
          note: 'Partner A requests onboarding criteria document to initiate client referrals.'
        }
      ],
      what_evidence_does_not_establish: [
        'Does not establish Harborpath\'s annual volume of corporate incorporations.'
      ],
      next_steps: [
        {
          action: 'Send corporate onboarding checklist and virtual account specification sheet to Partner A.',
          owner: 'Team member A',
          timing: '2026-08-22',
          verifiable: true
        }
      ],
      is_precomputed: true
    })
  },

  M02: {
    routes: ['internal_ops'],
    analysis: () => ({
      headline: 'LedgerBridge Technology Integration - Electronic Invoicing Gateway Architecture',
      what_happened: 'SpendNest strategy (Team member A) and product (Team member B) met with Supplier A from LedgerBridge to evaluate compliant electronic invoicing coverage across Singapore, Australia, and India. Discussed API integration flows, sandbox testing, and commercial licensing models.',
      why_it_matters: 'This is a technical vendor supplier evaluation for a Q4 product extension, NOT a sales opportunity. It belongs in internal operations and engineering review, not sales pipeline.',
      evidence_citations: [
        {
          id: 'm02-cite-1',
          type: 'turn',
          turn_number: 3,
          speaker: 'Team member B',
          reference: 'Turn 3',
          note: 'Team Member B confirms electronic invoicing is the core opportunity: "Customers already have approved invoice layouts. The manual part is taking that information into separate portals."'
        },
        {
          id: 'm02-cite-2',
          type: 'turn',
          turn_number: 29,
          speaker: 'Supplier A',
          reference: 'Turn 29',
          note: 'Supplier A outlines commercial licensing models: country licences with transaction usage, or licences per end customer with volume tiers.'
        },
        {
          id: 'm02-cite-3',
          type: 'turn',
          turn_number: 31,
          speaker: 'Supplier A',
          reference: 'Turn 31',
          note: 'Supplier A states pricing: "Basic setup begins at EUR 2,600; a more supported implementation starts at EUR 6,500... The initial setup covers the markets together."'
        }
      ],
      what_evidence_does_not_establish: [
        'Does not establish firm Q4 delivery commitment (Team member B notes early next year is possible if schedule slips).',
        'Does not establish volume estimates for issued invoices since receivables module is still in development.'
      ],
      next_steps: [
        {
          action: 'Supplier A to send volume template for country and customer tier projections.',
          owner: 'Supplier A',
          timing: '2026-08-22',
          verifiable: true
        },
        {
          action: 'SpendNest team to complete volume projections and conduct short pricing explanation call before presenting to management.',
          owner: 'Team member A',
          timing: '2026-08-25',
          verifiable: true
        }
      ],
      is_precomputed: true
    })
  },

  M03: {
    routes: ['deal_next_steps', 'sales_coaching'],
    analysis: () => ({
      headline: 'Asterloom Systems - Domestic Prepaid Card Evaluation & Pricing Presentation Coaching',
      what_happened: 'Team Member A met with Customer A and Customer B (Finance) from Asterloom Systems (~65 employees). Evaluated domestic prepaid cards for travel expenses. Key coaching moment occurred when Team Member A quoted INR 39,000 annual fee, causing Customer A to push back ("you previously told me INR 26,000"). Team Member A then clarified that INR 13,000 was a one-time accounting integration setup charge.',
      why_it_matters: 'Core pipeline evaluation. Transparent pricing communication is critical: bundling setup fees into recurring annual quotes without upfront explanation risks trust. Prospect proposed a 4-5 employee trial before CFO sign-off.',
      evidence_citations: [
        {
          id: 'm03-cite-1',
          type: 'turn',
          turn_number: 22,
          speaker: 'Team member A',
          reference: 'Turn 22',
          note: 'Team Member A quotes INR 39,000 plus tax for the cards arrangement up to INR 13 lakh monthly band.'
        },
        {
          id: 'm03-cite-2',
          type: 'turn',
          turn_number: 23,
          speaker: 'Customer A',
          reference: 'Turn 23',
          note: 'Customer A raises price discrepancy: "But you previously told me INR 26,000. Why has that become INR 39,000?"'
        },
        {
          id: 'm03-cite-3',
          type: 'turn',
          turn_number: 24,
          speaker: 'Team member A',
          reference: 'Turn 24',
          note: 'Rep clarifies breakdown: INR 26,000 recurring subscription plus INR 13,000 one-time accounting setup.'
        },
        {
          id: 'm03-cite-4',
          type: 'turn',
          turn_number: 26,
          speaker: 'Customer B',
          reference: 'Turn 26',
          note: 'Customer B proposes starting with a 4-5 employee travel card trial before wider rollout.'
        },
        {
          id: 'm03-cite-5',
          type: 'turn',
          turn_number: 36,
          speaker: 'Customer B',
          reference: 'Turn 36',
          note: 'Customer B requires written materials for CFO: "Send the details first. We need time with the CFO and will tell you if another call is needed."'
        }
      ],
      what_evidence_does_not_establish: [
        'Does not establish whether CFO will approve the initial 4-5 employee travel card trial.',
        'Does not establish vendor payables volume (estimated tentatively at INR 26-39 lakh/mo in Turn 34).'
      ],
      next_steps: [
        {
          action: 'Send structured proposal to Customer A and Customer B explicitly itemizing INR 26,000 annual subscription and INR 13,000 setup fee.',
          owner: 'Team member A',
          timing: '2026-08-22 EOD',
          verifiable: true
        },
        {
          action: 'Sales coaching 1-on-1 on fee transparency: always disclose recurring SaaS fees separately from one-time onboarding charges.',
          owner: 'Sales Manager',
          timing: '2026-08-25',
          verifiable: true
        },
        {
          action: 'Hold follow-up outreach until Asterloom internal CFO review completes (do not prematurely push for meetings).',
          owner: 'Team member A',
          timing: '2026-08-28',
          verifiable: true
        }
      ],
      is_precomputed: true
    })
  },

  M04: {
    routes: ['customer_success', 'deal_next_steps'],
    analysis: () => ({
      headline: 'Cedarwave Distribution - Card Migration & Corporate Credit Line Integration',
      what_happened: 'Team Member A met with Customer A and Customer B from Cedarwave Distribution to discuss migrating away from an existing card program. Customer A stated that moving from prepaid to corporate credit is their main requirement (Turn 11). Cedarwave already holds an INR 1.3 crore bank corporate credit line (Turn 22) and requested connecting bank credit cards for ~26 staff while keeping SpendNest prepaid cards for remaining employees.',
      why_it_matters: 'Key enterprise account at migration risk. Cedarwave requires a hybrid credit + prepaid solution with transaction feeds and receipt approvals syncing to accounting, rather than an all-prepaid replacement.',
      evidence_citations: [
        {
          id: 'm04-cite-1',
          type: 'turn',
          turn_number: 11,
          speaker: 'Customer A',
          reference: 'Turn 11',
          note: 'Customer A confirms priority: "moving from prepaid to credit is the main issue for us. At some stage we will have to consider another option for that."'
        },
        {
          id: 'm04-cite-2',
          type: 'turn',
          turn_number: 13,
          speaker: 'Customer A',
          reference: 'Turn 13',
          note: 'Customer A proposes hybrid model: "Perhaps we get credit cards for around 26 people and keep SpendNest prepaid cards for the others."'
        },
        {
          id: 'm04-cite-3',
          type: 'turn',
          turn_number: 22,
          speaker: 'Customer B',
          reference: 'Turn 22',
          note: 'Customer B: "We already have a corporate credit line of about INR 1.3 crore. Cards are issued to only a few people so far... If your platform can sit in between, we should understand that route."'
        }
      ],
      what_evidence_does_not_establish: [
        'Does not establish whether Cedarwave\'s bank credit card feed can be integrated into SpendNest\'s settlement feed.',
        'Does not establish source-balance accounting reconciliation feasibility for bank credit cards.'
      ],
      next_steps: [
        {
          action: 'Investigate technical and network feasibility of ingesting Cedarwave\'s bank-issued credit card transaction feeds.',
          owner: 'Team member A',
          timing: '2026-08-25',
          verifiable: true
        },
        {
          action: 'Prepare hybrid commercial proposal: bank credit card management for 26 users plus parallel prepaid program for remainder.',
          owner: 'Team member A',
          timing: '2026-08-26',
          verifiable: true
        }
      ],
      is_precomputed: true
    })
  },

  M06: {
    routes: ['deal_next_steps'],
    analysis: () => ({
      headline: 'Mapletrail Services - Branch Discovery & Decentralized Finance',
      what_happened: 'Discovery call with Customer A handling finance for one branch of Mapletrail Services (software testing). The branch manages local software subscriptions, while main corporate finance sits at head office.',
      why_it_matters: 'Potential expansion opportunity if branch workflow proves value to central finance.',
      evidence_citations: [
        {
          id: 'm06-cite-1',
          type: 'turn',
          turn_number: 2,
          speaker: 'Customer A',
          reference: 'Turn 2',
          note: 'Customer A explains branch vs central finance division of responsibilities.'
        },
        {
          id: 'm06-cite-2',
          type: 'turn',
          turn_number: 33,
          speaker: 'Customer A',
          reference: 'Turn 33',
          note: 'Customer A requests information package to share with head office.'
        }
      ],
      what_evidence_does_not_establish: [
        'Does not establish whether head office has approved decentralizing software purchasing.'
      ],
      next_steps: [
        {
          action: 'Send branch expense management deck suited for forwarding to central finance.',
          owner: 'Team member A',
          timing: '2026-08-22',
          verifiable: true
        }
      ],
      is_precomputed: true
    })
  },

  M07: {
    routes: (revision: number) => revision === 1 ? ['intake_exception'] : ['customer_support'],
    analysis: (revision: number) => {
      if (revision === 1) {
        return {
          headline: 'Willowfield Trust - Intake Awaiting Staged Transcript Delivery',
          what_happened: 'Meeting metadata received with 0 usable turns (recording status "recorded", organizer team09@example.com). Upstream delivery contract staged transcript delivery for subsequent update batch.',
          why_it_matters: 'Record held in intake exception queue; substantive conversation analysis deliberately withheld until verified speech text arrives.',
          evidence_citations: [
            {
              id: 'm07-cite-init',
              type: 'telemetry',
              reference: 'Delivery Envelope',
              note: 'Transcript withheld in initial delivery (01_initial.json); scheduled to arrive in update batch (02_update.json).'
            }
          ],
          what_evidence_does_not_establish: [
            'Does not establish meeting topics, attendee discussion, or operational action items.'
          ],
          next_steps: [
            {
              action: 'Ingest update batch 02_update.json to populate verified meeting transcript.',
              owner: 'System / Evaluator',
              timing: 'Batch Ingestion',
              verifiable: true
            }
          ],
          is_precomputed: true
        };
      }

      // Revision 2 (Update Batch)
      return {
        headline: 'Willowfield Trust - Customer Defect Review (4 UI & Payment Defects)',
        what_happened: 'Customer A demonstrated four distinct software defects via screen share with Team Member A: 1) Event-payment description editing reverts to old wording on save (Turns 2-7); 2) "Recreate payment" direct file upload fails (workaround: save, return to invoice inbox, open Review, attach file) (Turns 8-15); 3) Reimbursement payments stuck in "Processing" state and cannot be selected (Turns 16-19); 4) "Mark as paid" retains previous item\'s amount (INR 18,200) instead of refreshing to the next payment\'s value (Turns 20-25). Team Member A took screenshots and committed to getting confirmation from engineering.',
        why_it_matters: 'Severe customer-facing UI, document upload, and payment state bugs affecting accounting accuracy. Requires immediate technical investigation and support resolution.',
        evidence_citations: [
          {
            id: 'm07-cite-rev2-1',
            type: 'turn',
            turn_number: 2,
            speaker: 'Customer A',
            reference: 'Turn 2',
            note: 'Description editing failure: "I am changing this event-payment description to a short reference and clicking Save changes. Now look at the displayed description again."'
          },
          {
            id: 'm07-cite-rev2-2',
            type: 'turn',
            turn_number: 16,
            speaker: 'Customer A',
            reference: 'Turn 16',
            note: 'Reimbursement processing lock: "The next issue is in reimbursements. I cannot select the first group of transactions on this screen."'
          },
          {
            id: 'm07-cite-rev2-3',
            type: 'turn',
            turn_number: 21,
            speaker: 'Customer A',
            reference: 'Turn 21',
            note: 'Mark as paid amount retention: "When I use Mark as paid, the first payment shows INR 18,200... The amount from the previous item appears in the next one."'
          },
          {
            id: 'm07-cite-rev2-4',
            type: 'turn',
            turn_number: 27,
            speaker: 'Team member A',
            reference: 'Turn 27',
            note: 'Team member A commits: "I will send the details to the team, get their confirmation and come back to you."'
          }
        ],
        what_evidence_does_not_establish: [
          'Does not establish whether bugs affect all tenant workspaces or are restricted to specific browser environments.',
          'Does not establish whether an engineering ticket has already been logged prior to this call.'
        ],
        next_steps: [
          {
            action: 'Report the 4 documented defects (description persistence, recreate payment attachment, stuck reimbursement processing, mark as paid value retention) to engineering.',
            owner: 'Team member A',
            timing: 'Immediate (2026-08-21)',
            verifiable: true
          },
          {
            action: 'Provide engineering confirmation and resolution ETA to Customer A.',
            owner: 'Team member A',
            timing: '2026-08-22',
            verifiable: true
          }
        ],
        is_precomputed: true
      };
    }
  },

  M09: {
    routes: ['customer_support', 'customer_success'],
    analysis: () => ({
      headline: 'Brookmint Holdings - Onboarding Blocker: Expired Reset Token Defect & Account Architecture',
      what_happened: 'Team Member A met with Customer A to resolve onboarding issues for Brookmint Holdings and Northkite Equipment. Discussion covered shared mailbox vs individual administrator permissions (Turns 9-18). When Team Member A sent a fresh password reset email during the call, clicking the newly received link failed immediately with "token has expired" (Turn 21). Team Member A committed to investigating the token defect with engineering by EOD or Monday.',
      why_it_matters: 'Critical onboarding failure: newly generated invitation/reset tokens expire prematurely, blocking company administrator access for Brookmint Holdings (which houses the majority of users).',
      evidence_citations: [
        {
          id: 'm09-cite-1',
          type: 'turn',
          turn_number: 21,
          speaker: 'Customer A',
          reference: 'Turn 21',
          note: 'Customer A confirms fresh link failure: "It says the token has expired. This is the fresh message we just received."'
        },
        {
          id: 'm09-cite-2',
          type: 'turn',
          turn_number: 22,
          speaker: 'Team member A',
          reference: 'Turn 22',
          note: 'Team member A commitments: "I need to check that with the team. I hope to update you today, or by Monday at the latest. We have not got the Brookmint Holdings login working yet."'
        },
        {
          id: 'm09-cite-3',
          type: 'turn',
          turn_number: 31,
          speaker: 'Team member A',
          reference: 'Turn 31',
          note: 'Team member A reiterates deadline: "I will check the expired-token problem for Brookmint Holdings with the team and aim to return with an update today, otherwise Monday."'
        },
        {
          id: 'm09-cite-4',
          type: 'turn',
          turn_number: 32,
          speaker: 'Customer A',
          reference: 'Turn 32',
          note: 'Customer A next step: "I will speak to our IT team about the separate email identities. Thank you."'
        }
      ],
      what_evidence_does_not_establish: [
        'Does not establish whether the expired-token defect is caused by backend clock skew, token TTL configuration, or email client security scanners pre-fetching links.'
      ],
      next_steps: [
        {
          action: 'Investigate and resolve expired-token defect on Brookmint Holdings reset links with engineering by EOD or Monday.',
          owner: 'Team member A',
          timing: '2026-08-21 EOD / 2026-08-24',
          verifiable: true
        },
        {
          action: 'Customer A to consult internal IT team on establishing separate email identities for Brookmint Holdings vs Northkite Equipment.',
          owner: 'Customer A',
          timing: '2026-08-24',
          verifiable: true
        },
        {
          action: 'Customer A to review training video walkthroughs before scheduling subsequent admin workflow session.',
          owner: 'Customer A',
          timing: '2026-08-25',
          verifiable: true
        }
      ],
      is_precomputed: true
    })
  },

  M10: {
    routes: ['internal_ops'],
    analysis: () => ({
      headline: 'Internal Operations - Staff Training on Subscription Billing System',
      what_happened: 'Team Member A conducted internal training for Team Member B on SpendNest back-office subscription billing and invoice reconciliation workflows. Zero customer participation.',
      why_it_matters: 'Internal operational session. Must NOT be counted towards sales rep quota, opportunity discovery, or customer engagement.',
      evidence_citations: [
        {
          id: 'm10-cite-1',
          type: 'turn',
          turn_number: 3,
          speaker: 'Team member A',
          reference: 'Turn 3',
          note: 'Team Member A: "Yesterday we covered the subscription side of billing. Any questions before I show the remaining parts of the workflow?"'
        },
        {
          id: 'm10-cite-2',
          type: 'turn',
          turn_number: 20,
          speaker: 'Team member A',
          reference: 'Turn 20',
          note: 'Team Member A: "I will request the back-office access separately for the next training session."'
        }
      ],
      what_evidence_does_not_establish: [
        'Zero external customer involvement.'
      ],
      next_steps: [
        {
          action: 'Provision back-office billing sandbox access for Team Member B.',
          owner: 'Team member A',
          timing: '2026-08-22',
          verifiable: true
        }
      ],
      is_precomputed: true
    })
  }
};

export function getFallbackAnalysis(
  record_ref: string,
  source_type: 'call' | 'meeting',
  payload: any,
  transcript_payload: any
): ConversationAnalysis {
  if (source_type === 'meeting') {
    const status = payload.recording_status;
    const detail = payload.recording_detail || transcript_payload?.unavailable_reason || 'No audio recorded.';
    return {
      headline: `Unattended Meeting (${status}) - ${payload.title}`,
      what_happened: `Meeting recording status is '${status}'. Reason: ${detail}`,
      why_it_matters: 'No usable speech captured. Record placed in intake exception triage; substantive analysis deliberately withheld.',
      evidence_citations: [
        {
          id: `${record_ref}-telemetry`,
          type: 'telemetry',
          reference: 'Calendar Metadata',
          note: `Organizer: ${payload.organizer_email || 'None'}. Provider: ${payload.provider}. Status: ${status}`
        }
      ],
      what_evidence_does_not_establish: [
        'Does not prove whether human participants met outside of the recorded bot bridge.'
      ],
      next_steps: [
        {
          action: 'Verify with meeting organizer whether rescheduling is necessary.',
          owner: payload.organizer_email || 'Meeting Organizer',
          timing: 'Next Business Day',
          verifiable: false
        }
      ],
      is_precomputed: true
    };
  }

  // Background call fallback (B01 - B20)
  return {
    headline: `Telephony Exception - ${payload.observed_outcome || 'Unreached'} (${payload.duration_seconds}s)`,
    what_happened: `Call placed by rep ${payload.rep_name || 'Unknown'}. Telephony outcome: ${payload.observed_outcome || 'unknown'}. Upstream connected flag: ${payload.is_connected}.`,
    why_it_matters: 'No transcript was captured or supplied. Stored in telephony intake; substantive analysis withheld.',
    evidence_citations: [
      {
        id: `${record_ref}-telemetry`,
        type: 'telemetry',
        reference: 'Call Metadata',
        note: `Duration: ${payload.duration_seconds}s. Connected: ${payload.is_connected}. Outcome: ${payload.observed_outcome}`
      }
    ],
    what_evidence_does_not_establish: [
      'Does not establish whether voice message was heard or callback is expected.'
    ],
    next_steps: [],
    is_precomputed: true
  };
}
