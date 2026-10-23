import { ConversationAnalysis, RouteCategory } from '../domain/types.js';

export const DOSSIERS: Record<string, {
  routes: RouteCategory[];
  analysis: (revision: number) => ConversationAnalysis;
}> = {
  // --- CALLS ---
  C01: {
    routes: ['sales_coaching'],
    analysis: () => ({
      headline: 'Unprepared Cold Outreach - Immediate Rejection & Cutoff',
      what_happened: 'Rep Arun contacted Pranav at Harborlight Advisory without articulating why SpendNest was relevant to outsourced finance firms. Pranav asked "Why are you calling?" and immediately terminated the conversation.',
      why_it_matters: 'Arun pitched generic features instead of leading with a pain point relevant to advisory practices, resulting in a burned contact and zero discovery.',
      evidence_citations: [
        {
          id: 'c01-cite-1',
          type: 'quote',
          reference: 'Spoken Transcript',
          quote: 'Why are you calling? We work with outsourced finance... I am not interested. Please remove our number.',
          note: 'Prospect immediately identifies mismatched proposition and demands removal.'
        }
      ],
      what_evidence_does_not_establish: [
        'Does not establish whether Harborlight Advisory has existing expense software.',
        'Does not establish if Arun had prior contact with other partners.'
      ],
      next_steps: [
        {
          action: 'Manager 1-on-1 coaching with Arun on value hooks for outsourced accounting firms.',
          owner: 'Sales Manager',
          timing: 'Immediate',
          verifiable: true
        },
        {
          action: 'Mark phone number as Do-Not-Call per prospect demand.',
          owner: 'Arun',
          timing: 'EOD 2026-08-21',
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
      headline: 'Voicemail Left After Email Bounce - Upstream Telemetry Mismatch',
      what_happened: 'Arun navigated an automated screening gatekeeper and left a 95-second detailed voicemail for Ritesh at Lanternpath Media regarding corrected email collateral.',
      why_it_matters: 'Upstream metadata marked this call as `is_connected: false`, but Arun successfully passed gatekeeper screening and left a structured re-engagement voicemail.',
      evidence_citations: [
        {
          id: 'c04-cite-1',
          type: 'quote',
          reference: 'Spoken Transcript',
          quote: "Arun from SpendNest here. I'm following up on your consideration of our expense platform for Lanternpath Media. My understanding is that our information first went to the wrong email address.",
          note: 'Arun speaks directly into voicemail explaining email delivery correction.'
        }
      ],
      what_evidence_does_not_establish: [
        'Does not establish whether Ritesh received or opened the corrected email.'
      ],
      discrepancy: {
        field: 'is_connected',
        upstream_claim: 'false',
        spoken_reality: 'Spoke 95 seconds; automated screening passed; voicemail recorded.',
        impact_explanation: 'Telephony telemetry counted this as an unreached dial, hiding substantial rep effort.',
        severity: 'medium'
      },
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
      headline: 'LedgerBridge Technology Integration - Vendor Architecture Session',
      what_happened: 'SpendNest strategy team met with Supplier A from LedgerBridge. LedgerBridge is an electronic invoicing and AP gateway vendor pitching technical integration options (white-labeling vs standard connector).',
      why_it_matters: 'This is NOT a sales lead! This is a technical vendor supplier discussion that must be routed to Engineering/Product, not revenue pipeline.',
      evidence_citations: [
        {
          id: 'm02-cite-1',
          type: 'turn',
          turn_number: 2,
          speaker: 'Supplier A',
          reference: 'Turn 2',
          note: 'Supplier A outlines technical integration options for electronic invoicing.'
        },
        {
          id: 'm02-cite-2',
          type: 'turn',
          turn_number: 3,
          speaker: 'Team member B',
          reference: 'Turn 3',
          note: 'Team Member B confirms electronic invoicing opportunity aligns with customer demand.'
        }
      ],
      what_evidence_does_not_establish: [
        'Does not establish API latency SLAs or commercial contract terms.'
      ],
      next_steps: [
        {
          action: 'Forward LedgerBridge schema and invoice mapping template to Product Engineering.',
          owner: 'Team member B',
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
      headline: 'Asterloom Systems - High-Value Evaluation with CFO Gatekeeper',
      what_happened: 'Customer A and Customer B (Finance) evaluated SpendNest corporate cards and accounting automation. Current process: slow payroll reimbursement. Key objections: overseas card provider already chosen; CFO is price-sensitive but demands clean monthly accounting reconciliation.',
      why_it_matters: 'Core pipeline deal. Customer B emphasized that CFO approval is required before scheduling any further calls, and requested written materials first.',
      evidence_citations: [
        {
          id: 'm03-cite-1',
          type: 'turn',
          turn_number: 3,
          speaker: 'Customer B',
          reference: 'Turn 3',
          note: 'Customer B highlights domestic payroll reimbursement pain vs established overseas provider.'
        },
        {
          id: 'm03-cite-2',
          type: 'turn',
          turn_number: 36,
          speaker: 'Customer B',
          reference: 'Turn 36',
          note: 'Customer B: "Send the details first. We need time with the CFO... Let us make that decision internally before scheduling anything."'
        }
      ],
      what_evidence_does_not_establish: [
        'Does not establish company budget or definitive employee headcount.'
      ],
      next_steps: [
        {
          action: 'Send executive summary and accounting reconciliation whitepaper tailored for the CFO.',
          owner: 'Team member A',
          timing: '2026-08-22 EOD',
          verifiable: true
        },
        {
          action: 'Hold follow-up scheduling until internal CFO review completes (do not pressure for next call).',
          owner: 'Team member A',
          timing: '2026-08-28',
          verifiable: true
        }
      ],
      is_precomputed: true
    })
  },

  M04: {
    routes: ['customer_success'],
    analysis: () => ({
      headline: 'Cedarwave Distribution - Card Program Migration & Fuel Acceptance',
      what_happened: 'Team Member A reviewed card migration timeline with Customer A. Customer uses physical cards heavily and has experienced transaction declines at fuel outlets. Customer expressed concern regarding wallet-payment transition timing.',
      why_it_matters: 'Customer retention risk. Physical card acceptance failures directly impact field logistics and operations.',
      evidence_citations: [
        {
          id: 'm04-cite-1',
          type: 'turn',
          turn_number: 2,
          speaker: 'Team member A',
          reference: 'Turn 2',
          note: 'Team Member A notes acceptance problems with existing card provider at fuel outlets.'
        },
        {
          id: 'm04-cite-2',
          type: 'turn',
          turn_number: 32,
          speaker: 'Customer A',
          reference: 'Turn 32',
          note: 'Customer A agrees to review migration timeline and verify fleet driver counts.'
        }
      ],
      what_evidence_does_not_establish: [
        'Does not establish whether card decline issue is merchant-code specific or network level.'
      ],
      next_steps: [
        {
          action: 'Provide written migration FAQ on fuel merchant category acceptance for drivers.',
          owner: 'Team member A',
          timing: '2026-08-24',
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
    routes: ['customer_support'],
    analysis: (revision: number) => {
      if (revision === 1) {
        return {
          headline: 'Intake Awaiting Late Transcript Delivery',
          what_happened: 'Meeting metadata received with 0 usable turns. Upstream delivery noted transcript will arrive in update batch.',
          why_it_matters: 'Record is staged in intake; substantive analysis withheld until verified transcript arrives.',
          evidence_citations: [
            {
              id: 'm07-cite-init',
              type: 'telemetry',
              reference: 'Delivery Envelope',
              note: 'Transcript withheld in initial delivery; scheduled to arrive in batch update-002.'
            }
          ],
          what_evidence_does_not_establish: [
            'Does not establish meeting discussion topics or attendee sentiment.'
          ],
          next_steps: [
            {
              action: 'Ingest update-002 batch to populate complete transcript.',
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
        headline: 'Willowfield Trust - Bug Report: UI Description Editing Failure',
        what_happened: 'Customer A shared screen to demonstrate a reproduction of a software bug: editing an event-payment description reverts to the old wording upon saving. Team Member A confirmed the defect and committed to logging it with engineering.',
        why_it_matters: 'Severe UX/data persistence defect affecting customer records. Must be routed to Engineering/Product Support immediately.',
        evidence_citations: [
          {
            id: 'm07-cite-rev2-1',
            type: 'turn',
            turn_number: 2,
            speaker: 'Customer A',
            reference: 'Turn 2',
            note: 'Customer A shows screen: changing event-payment description does not persist after clicking save.'
          },
          {
            id: 'm07-cite-rev2-2',
            type: 'turn',
            turn_number: 26,
            speaker: 'Team member A',
            reference: 'Turn 26',
            note: 'Team member A commits: "I will send the details to the team, get their confirmation and come back to you."'
          }
        ],
        what_evidence_does_not_establish: [
          'Does not establish whether defect affects all browser clients or specific tenant permissions.'
        ],
        next_steps: [
          {
            action: 'File high-priority Jira bug ticket for payment description mutation failure.',
            owner: 'Team member A',
            timing: 'Immediate (2026-08-21)',
            verifiable: true
          },
          {
            action: 'Provide engineering confirmation to Customer A.',
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
      headline: 'Brookmint Holdings - Onboarding Blocker: Invitation Link Failure',
      what_happened: 'Customer A reported that account invitation links for Brookmint Holdings failed to activate. Discussion focused on multi-entity tenant access and separating work email identities across business divisions.',
      why_it_matters: 'Onboarding defect blocking tenant user activation.',
      evidence_citations: [
        {
          id: 'm09-cite-1',
          type: 'turn',
          turn_number: 1,
          speaker: 'Customer A',
          reference: 'Turn 1',
          note: 'Customer A: "The invitation for Brookmint Holdings did not work... A fresh link would help."'
        },
        {
          id: 'm09-cite-2',
          type: 'turn',
          turn_number: 32,
          speaker: 'Customer A',
          reference: 'Turn 32',
          note: 'Customer A agrees to review separate email identities with internal IT.'
        }
      ],
      what_evidence_does_not_establish: [
        'Does not establish whether invitation expiration was caused by token expiry or SSO misconfiguration.'
      ],
      next_steps: [
        {
          action: 'Re-issue fresh tenant invitation link for Brookmint Holdings account.',
          owner: 'Team member A',
          timing: 'Immediate',
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
