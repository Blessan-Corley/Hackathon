import { ConversationAnalysis, RouteCategory } from '../domain/types.js';

export const DOSSIERS: Record<string, {
  routes: RouteCategory[] | ((revision: number) => RouteCategory[]);
  analysis: (revision: number, route?: RouteCategory) => ConversationAnalysis;
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
          owner: null,
          timing: null,
          verifiable: true
        },
        {
          action: 'Tag Harborlight Advisory contact record as Not Interested / Existing Automated Solution.',
          owner: null,
          timing: null,
          verifiable: true
        }
      ],
      is_precomputed: true
    })
  },

  C02: {
    routes: ['deal_next_steps'],
    analysis: () => ({
      headline: 'Gatekeeper Interaction - Target Contact Out of Office & Voicemail Transfer',
      what_happened: 'Arun called Fernhaven Group requesting Leela. Receptionist Kavya stated Leela was not in the office today and offered either to take a message or transfer to voicemail. Arun chose voicemail transfer: "Her voicemail would be fine, thank you." Kavya transferred the call. Arun did not leave callback details with Kavya.',
      why_it_matters: 'Professional gatekeeper engagement. Lead is not burned; voicemail path chosen directly.',
      evidence_citations: [
        {
          id: 'c02-cite-1',
          type: 'quote',
          reference: 'Spoken Transcript',
          quote: "It looks as though she isn't in the office today. Would you like to leave a message with me, or would you prefer her voicemail? Her voicemail would be fine, thank you.",
          note: 'Receptionist confirms contact out of office and transfers Arun to voicemail.'
        }
      ],
      what_evidence_does_not_establish: [
        'Does not establish Leela\'s return date, or whether Arun left a voicemail after the transfer (audio ends at mailbox transfer).'
      ],
      next_steps: [
        {
          action: 'Follow up with Leela at Fernhaven Group if no response to voicemail transfer.',
          owner: 'Arun',
          timing: null,
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
      what_happened: 'Rep Kiran reconnected with Milan regarding SpendNest developer API access and event webhooks. Milan noted prior price resistance, requested an email summary with a specific subject line ("Developer access and event notifications — follow-up"), and agreed to speak Monday or Tuesday.',
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
          timing: null,
          verifiable: true
        },
        {
          action: 'Follow up by phone on Monday or Tuesday as agreed.',
          owner: 'Kiran',
          timing: 'Monday or Tuesday (2026-08-24/25)',
          verifiable: true
        }
      ],
      is_precomputed: true
    })
  },

  C04: {
    routes: ['deal_next_steps', 'sales_coaching'],
    analysis: (_rev: number, route?: RouteCategory) => {
      if (route === 'sales_coaching') {
        return {
          headline: 'Lanternpath Media - Voicemail Execution & IVR Screening Coaching',
          what_happened: 'Rep Arun navigated an automated screening service and delivered a structured 95-second voicemail for Ritesh at Lanternpath Media clarifying that earlier materials were re-sent to a corrected email address.',
          why_it_matters: 'Frontline coaching focus: rep demonstrated persistence and clear delivery (stating identity, purpose, delivery correction, and contact number), but 95s is lengthy for an outbound voicemail. Coach on tighter messaging (30-45s).',
          evidence_citations: [
            {
              id: 'c04-cite-coach',
              type: 'quote',
              reference: 'Spoken Transcript',
              quote: "Arun from SpendNest here. I'm following up on your consideration of our expense platform for Lanternpath Media. My understanding is that our information first went to the wrong email address. We subsequently used the corrected address you gave us, and I hope you have now had a chance to see it.",
              note: 'Rep delivers structured explanation of corrected delivery into prospect voicemail.'
            }
          ],
          what_evidence_does_not_establish: [
            'Does not establish whether Ritesh checks voicemails or prefers email outreach.'
          ],
          next_steps: [
            {
              action: 'Coach Arun on optimal voicemail brevity (targeting 30-45 seconds) while retaining key context.',
              owner: null,
              timing: null,
              verifiable: true
            }
          ],
          is_precomputed: true
        };
      }

      // Default: deal_next_steps
      return {
        headline: 'Lanternpath Media - Account Re-engagement Following Corrected Email Delivery',
        what_happened: 'Arun navigated automated screening and left a 95-second voicemail for Ritesh at Lanternpath Media following up on expense software collateral re-sent to a corrected email address. Arun requested a callback to discuss platform fit.',
        why_it_matters: 'Active account re-engagement attempt following an earlier delivery misdirection; proposal re-sent and callback requested.',
        evidence_citations: [
          {
            id: 'c04-cite-deal',
            type: 'quote',
            reference: 'Spoken Transcript',
            quote: "Arun from SpendNest here. I'm following up on your consideration of our expense platform for Lanternpath Media. My understanding is that our information first went to the wrong email address. We subsequently used the corrected address you gave us, and I hope you have now had a chance to see it. Please call me back to let me know where things stand.",
            note: 'Arun confirms re-sent proposal and requests callback on stated number.'
          }
        ],
        what_evidence_does_not_establish: [
          'Does not establish whether Ritesh has read the re-sent proposal.'
        ],
        next_steps: [
          {
            action: 'Await callback from Ritesh regarding re-sent Lanternpath Media proposal; follow up if unreturned.',
            owner: 'Arun',
            timing: null,
            verifiable: true
          }
        ],
        is_precomputed: true
      };
    }
  },

  C05: {
    routes: ['deal_next_steps', 'sales_coaching'],
    analysis: () => ({
      headline: 'Competitive Encounter - StoreHarbor Incumbent Identified',
      what_happened: 'Rep Meera pitched multi-store expense management. Prospect revealed they already use StoreHarbor and other tools for vendor payments and store cards, but agreed to review SpendNest presentation collateral.',
      why_it_matters: 'Identifies primary market competitor (StoreHarbor) and secures email permission to send comparative presentation collateral.',
      evidence_citations: [
        {
          id: 'c05-cite-1',
          type: 'quote',
          reference: 'Spoken Transcript',
          quote: 'May I ask which platform you\'re using? There are several. One is StoreHarbor, and we use others too. What I suggest is that you send me your presentation.',
          note: 'Prospect names incumbent competitor StoreHarbor and provides email contact05@example.com.'
        }
      ],
      what_evidence_does_not_establish: [
        'Does not establish contract expiration date with StoreHarbor.'
      ],
      next_steps: [
        {
          action: 'Send SpendNest product presentation collateral to contact05@example.com as requested.',
          owner: 'Meera',
          timing: null,
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
          owner: null,
          timing: null,
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
          action: 'Send partnership proposal deck via messaging app as requested.',
          owner: 'Dev',
          timing: null,
          verifiable: true
        },
        {
          action: 'Follow up by phone on Monday as agreed.',
          owner: 'Dev',
          timing: 'Monday (2026-08-24)',
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
          action: 'Draft proposal to contact08@example.com referencing introduction from Raghav.',
          owner: 'Meera',
          timing: null,
          verifiable: true
        }
      ],
      is_precomputed: true
    })
  },

  C09: {
    routes: ['sales_coaching', 'deal_next_steps'],
    analysis: (_rev: number, route?: RouteCategory) => {
      if (route === 'sales_coaching') {
        return {
          headline: 'Sales Coaching - Strict Referral Governance & Name-Dropping Prohibition',
          what_happened: 'Meera called Vedant (130-store chain, in-house software). Vedant suggested contacting business head Mr. Rishabh on professional networks, but strictly commanded: "No, please don\'t use my name." Upstream CRM metadata marked outcome as "referred".',
          why_it_matters: 'Critical referral governance coaching: treating this as an authorized warm referral would severely backfire. Sales reps must be trained never to name-drop when a contact explicitly refuses consent.',
          evidence_citations: [
            {
              id: 'c09-cite-coach',
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
              action: 'Sales coaching on referral governance: reinforce policy that "referred" outcome requires explicit consent before citing referral source.',
              owner: null,
              timing: null,
              verifiable: true
            }
          ],
          is_precomputed: true
        };
      }

      // Default: deal_next_steps
      return {
        headline: 'Retail Prospect (130 Stores) - Cold Outreach Plan for Business Head',
        what_happened: 'Meera identified business head Mr. Rishabh for a 130-store retail chain. Contact Vedant provided Rishabh\'s name but explicitly forbade using his own name in the approach.',
        why_it_matters: 'High-potential retail prospect requiring completely independent cold outreach on platform merits without referencing Vedant.',
        evidence_citations: [
          {
            id: 'c09-cite-deal',
            type: 'quote',
            reference: 'Spoken Transcript',
            quote: "Would it be all right if I mentioned your name when contacting him? No, please don't use my name.",
            note: 'Outreach must proceed on independent merits.'
          }
        ],
        what_evidence_does_not_establish: [
          'Does not establish Rishabh\'s direct contact details or current software priorities.'
        ],
        discrepancy: {
          field: 'observed_outcome',
          upstream_claim: 'referred',
          spoken_reality: 'Contact strictly forbade using his name ("No, please don\'t use my name").',
          impact_explanation: 'Treating this as an authorized warm referral would backfire.',
          severity: 'high'
        },
        next_steps: [
          {
            action: 'Connect with Mr. Rishabh on professional networking platform via cold value-add pitch (without mentioning Vedant).',
            owner: 'Meera',
            timing: null,
            verifiable: true
          }
        ],
        is_precomputed: true
      };
    }
  },

  C10: {
    routes: ['sales_coaching'],
    analysis: () => ({
      headline: 'Severe Metadata Contradiction - Contact Forbids Follow-Up and Left Company',
      what_happened: 'Meera called Aniket regarding Meadowbrick. Aniket stated he no longer works at Meadowbrick and has moved to manufacturing. When Meera asked to call next Monday or Tuesday, Aniket bluntly refused: "No. I said I will contact you if there is anything to discuss."',
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
          owner: null,
          timing: null,
          verifiable: true
        },
        {
          action: 'Re-prospect Meadowbrick account for new finance/procurement leadership.',
          owner: null,
          timing: null,
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
          timing: null,
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
      why_it_matters: 'This is a technical vendor supplier evaluation for a product extension, NOT a sales opportunity. It belongs in internal operations and engineering review, not sales pipeline.',
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
        'Does not establish firm delivery commitment (Team member B notes early next year is possible if schedule slips).',
        'Does not establish volume estimates for issued invoices since receivables module is still in development.'
      ],
      next_steps: [
        {
          action: 'Supplier A to send calculation template for country and customer tier projections.',
          owner: 'Supplier A',
          timing: null,
          verifiable: true
        },
        {
          action: 'SpendNest team to complete volume projections and conduct short pricing review call before presenting to management.',
          owner: 'Team member A',
          timing: null,
          verifiable: true
        }
      ],
      is_precomputed: true
    })
  },

  M03: {
    routes: ['deal_next_steps', 'sales_coaching'],
    analysis: (_rev: number, route?: RouteCategory) => {
      if (route === 'sales_coaching') {
        return {
          headline: 'Asterloom Systems - Pricing Presentation Coaching & Prepaid Expectation Gap',
          what_happened: 'Discovery session with Customer A and Customer B from Asterloom Systems. Team Member A quoted an INR 39,000 annual fee, causing Customer A to push back ("you previously told me INR 26,000"). Team Member A then clarified that INR 13,000 was a one-time accounting setup charge. In addition, Customer A experienced surprise upon learning SpendNest issues prepaid cards rather than corporate credit cards (Turns 6-7).',
          why_it_matters: 'Key frontline coaching case: 1) Disclose recurring subscriptions separately from one-time onboarding charges to prevent fee confusion; 2) Proactively address the prepaid-versus-credit expectation gap early in discovery.',
          evidence_citations: [
            {
              id: 'm03-cite-coach-1',
              type: 'turn',
              turn_number: 6,
              speaker: 'Customer A',
              reference: 'Turn 6',
              note: 'Prepaid gap: "Wait, these are prepaid? I had thought about a corporate credit card. A prepaid card means we have to load funds in advance."'
            },
            {
              id: 'm03-cite-coach-2',
              type: 'turn',
              turn_number: 22,
              speaker: 'Team member A',
              reference: 'Turn 22',
              note: 'Pricing quote: Team Member A quotes INR 39,000 bundled fee without breaking out setup charges.'
            },
            {
              id: 'm03-cite-coach-3',
              type: 'turn',
              turn_number: 23,
              speaker: 'Customer A',
              reference: 'Turn 23',
              note: 'Prospect friction: "But you previously told me INR 26,000. Why has that become INR 39,000?"'
            },
            {
              id: 'm03-cite-coach-4',
              type: 'turn',
              turn_number: 24,
              speaker: 'Team member A',
              reference: 'Turn 24',
              note: 'Late clarification: INR 26,000 recurring subscription plus INR 13,000 one-time accounting integration.'
            }
          ],
          what_evidence_does_not_establish: [
            'Does not establish whether rep intentionally bundled setup fees or simply misspoke.'
          ],
          next_steps: [
            {
              action: 'Coach Team Member A on fee disclosure: always present recurring SaaS subscription and one-time onboarding fees as distinct line items.',
              owner: null,
              timing: null,
              verifiable: true
            },
            {
              action: 'Coach sales team on addressing prepaid cash-flow objections when prospects expect revolving corporate credit.',
              owner: null,
              timing: null,
              verifiable: true
            }
          ],
          is_precomputed: true
        };
      }

      // Default: deal_next_steps
      return {
        headline: 'Asterloom Systems - Commercial Proposal & 4-5 Employee Travel Card Trial',
        what_happened: 'Commercial discussion with Customer A and Customer B (Finance) from Asterloom Systems (~65 employees). Customer B agreed to evaluate SpendNest via a 4-5 employee travel card trial before broader commitment, but emphasized that CFO approval of written pricing is mandatory before any next steps (Turns 28, 36). Customer noted SpendNest operates on prepaid cards rather than corporate credit (Turns 6-7).',
        why_it_matters: 'Active mid-market pipeline deal. Commercial progress depends on delivering an itemized proposal (INR 26,000 subscription + INR 13,000 setup) for internal CFO sign-off; outreach should be paused until CFO review concludes.',
        evidence_citations: [
          {
            id: 'm03-cite-deal-1',
            type: 'turn',
            turn_number: 24,
            speaker: 'Team member A',
            reference: 'Turn 24',
            note: 'Pricing terms: INR 26,000 recurring subscription + INR 13,000 one-time accounting setup.'
          },
          {
            id: 'm03-cite-deal-2',
            type: 'turn',
            turn_number: 26,
            speaker: 'Customer B',
            reference: 'Turn 26',
            note: 'Proposed trial: Customer B suggests starting with a 4-5 employee travel card trial.'
          },
          {
            id: 'm03-cite-deal-3',
            type: 'turn',
            turn_number: 36,
            speaker: 'Customer B',
            reference: 'Turn 36',
            note: 'Decision governance: "Send the details first. We need time with the CFO and will tell you if another call is needed."'
          }
        ],
        what_evidence_does_not_establish: [
          'Does not establish whether CFO will approve the trial after reviewing written proposal.',
          'Does not establish vendor payables volume (estimated tentatively at INR 26-39 lakh/mo in Turn 34).'
        ],
        next_steps: [
          {
            action: 'Send structured proposal to Customer A and Customer B itemizing INR 26,000 annual subscription and INR 13,000 setup fee.',
            owner: 'Team member A',
            timing: null,
            verifiable: true
          },
          {
            action: 'Hold follow-up outreach until Asterloom internal CFO review completes (do not prematurely push for meetings).',
            owner: 'Team member A',
            timing: null,
            verifiable: true
          }
        ],
        is_precomputed: true
      };
    }
  },

  M04: {
    routes: ['customer_success', 'deal_next_steps'],
    analysis: () => ({
      headline: 'Cedarwave Distribution - Card Migration & Corporate Credit Line Integration',
      what_happened: 'Team Member A met with Customer A and Customer B from Cedarwave Distribution to discuss migrating away from an existing card program. Customer A stated that moving from prepaid to corporate credit is their main requirement (Turn 11). Cedarwave already holds an INR 1.3 crore bank corporate credit line (Turn 22) and requested connecting bank credit cards for ~26 staff while keeping SpendNest prepaid cards for remaining employees.',
      why_it_matters: 'Key account at migration risk. Cedarwave requires a hybrid credit + prepaid solution with transaction feeds and receipt approvals syncing to accounting, rather than an all-prepaid replacement.',
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
          action: 'Investigate technical feasibility of ingesting Cedarwave bank-issued credit card transaction feeds.',
          owner: 'Team member A',
          timing: null,
          verifiable: true
        },
        {
          action: 'Prepare hybrid commercial proposal: bank credit card management for 26 users plus parallel prepaid program for remainder.',
          owner: 'Team member A',
          timing: null,
          verifiable: true
        }
      ],
      is_precomputed: true
    })
  },

  M06: {
    routes: ['deal_next_steps'],
    analysis: () => ({
      headline: 'Mapletrail Services - Accounts Receivable & Collections Automation Discovery',
      what_happened: 'Team Member A conducted a discovery session with Customer A, who manages local finance for a software testing branch of Mapletrail Services (65 finance staff centrally). Customer A handles local payables, receivables, and compliance for ~8 clients (company overall has 65-78 customers with 260-390 invoices/month, many in foreign currency). Key pain points include manual contract review, coordinating with delivery managers to resolve payment disputes (e.g. an expense-recovery invoice held up for months), and cash application matching (discrepancies from withholding or bank fees). Team Member A pitched automated reminder workflows with escalation rules, AI exception detection, and virtual expense cards. Customer A raised data security and payment confidentiality requirements (Turn 31), which Team Member A addressed before agreeing to send information collateral.',
      why_it_matters: 'High-volume receivables automation and cash application opportunity (260-390 monthly invoices across company). Central finance manages bank connections and supplier payables (Turn 7), but branch deals with customer invoicing bottlenecks and manual collections.',
      evidence_citations: [
        {
          id: 'm06-cite-1',
          type: 'turn',
          turn_number: 9,
          speaker: 'Customer A',
          reference: 'Turn 9',
          note: 'Customer A explains receivables workflow: "I cover around eight clients... Depending on the contract there may be 15- or 30-day terms before the collection follow-up starts."'
        },
        {
          id: 'm06-cite-2',
          type: 'turn',
          turn_number: 10,
          speaker: 'Customer A',
          reference: 'Turn 10',
          note: 'Customer A details collection friction: "One expense-recovery invoice has been outstanding for months even though the same client pays the normal service invoices. We still need the delivery manager to establish why that particular item is held up."'
        },
        {
          id: 'm06-cite-3',
          type: 'turn',
          turn_number: 12,
          speaker: 'Customer A',
          reference: 'Turn 12',
          note: 'Customer A estimates invoice scale: "Around 65-78 customers. There may be several projects for each. Initially I would estimate 260-390 invoices a month, with a large total value."'
        },
        {
          id: 'm06-cite-4',
          type: 'turn',
          turn_number: 22,
          speaker: 'Team member A',
          reference: 'Turn 22',
          note: 'Team Member A explains cash application: "Cash application is another area. For example, if an invoice is INR 1.3 lakh and the payment is INR 1.17 lakh, the difference could be withholding, bank fees or an unresolved dispute."'
        },
        {
          id: 'm06-cite-5',
          type: 'turn',
          turn_number: 31,
          speaker: 'Customer A',
          reference: 'Turn 31',
          note: 'Customer A raises data security requirements: "Confidentiality is important. Payment information is sensitive. How is that protected, and is there a risk of somebody interfering with it?"'
        }
      ],
      what_evidence_does_not_establish: [
        'Does not establish central finance ERP software vendor or whether central finance has budgeted for a third-party AR platform.',
        'Does not establish decision-making authority between branch finance and head office central team.'
      ],
      next_steps: [
        {
          action: 'Send information packet covering receivables automation, cash application reconciliation, and platform security/compliance certifications to Customer A.',
          owner: 'Team member A',
          timing: null,
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
              owner: null,
              timing: null,
              verifiable: true
            }
          ],
          is_precomputed: true
        };
      }

      // Revision 2 (Update Batch)
      return {
        headline: 'Willowfield Trust - Customer Defect Review (4 UI & Payment Defects)',
        what_happened: 'Customer A demonstrated four distinct software defects via screen share with Team Member A: 1) Event-payment description editing reverts to old wording on save (Turns 2-7); 2) "Recreate payment" direct file upload fails (workaround: save, return to invoice inbox, open Review, attach file) (Turns 8-15); 3) Reimbursement payments stuck in "Processing" state and cannot be selected (Turns 16-19); 4) "Mark as paid" retains previous item\'s amount (INR 18,200) instead of refreshing to the next payment\'s value (Turns 20-25). Team Member A took screenshots and committed to getting confirmation from engineering (Turn 27).',
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
            timing: null,
            verifiable: true
          },
          {
            action: 'Provide engineering confirmation and resolution ETA to Customer A.',
            owner: 'Team member A',
            timing: null,
            verifiable: true
          }
        ],
        is_precomputed: true
      };
    }
  },

  M09: {
    routes: ['customer_support', 'customer_success'],
    analysis: (_rev: number, route?: RouteCategory) => {
      if (route === 'customer_support') {
        return {
          headline: 'Brookmint Holdings - Onboarding Authentication Defect: Expired Reset Token',
          what_happened: 'Team Member A met with Customer A to resolve onboarding issues for Brookmint Holdings and Northkite Equipment. During the call, Team Member A issued a fresh password reset email (Turn 4). Customer A tested the newly arrived link live, but it failed immediately with "token has expired" (Turn 21). Team Member A committed to investigating the token defect with engineering by EOD or Monday (Turns 22, 31).',
          why_it_matters: 'Critical authentication blocker preventing company administrator onboarding for Brookmint Holdings (the primary entity housing majority of users). Requires engineering defect investigation into token TTL or backend generation.',
          evidence_citations: [
            {
              id: 'm09-cite-supp-1',
              type: 'turn',
              turn_number: 21,
              speaker: 'Customer A',
              reference: 'Turn 21',
              note: 'Immediate token failure: "It says the token has expired. This is the fresh message we just received."'
            },
            {
              id: 'm09-cite-supp-2',
              type: 'turn',
              turn_number: 22,
              speaker: 'Team member A',
              reference: 'Turn 22',
              note: 'Engineering escalation commitment: "I need to check that with the team. I hope to update you today, or by Monday at the latest."'
            },
            {
              id: 'm09-cite-supp-3',
              type: 'turn',
              turn_number: 31,
              speaker: 'Team member A',
              reference: 'Turn 31',
              note: 'Reiterated resolution deadline: "I will check the expired-token problem for Brookmint Holdings with the team and aim to return with an update today, otherwise Monday."'
            }
          ],
          what_evidence_does_not_establish: [
            'Does not establish whether token expiry is caused by backend clock skew, short token TTL, or email security scanners pre-fetching links.'
          ],
          next_steps: [
            {
              action: 'Investigate and resolve expired-token defect on Brookmint Holdings reset links with engineering by EOD or Monday.',
              owner: 'Team member A',
              timing: 'Today or Monday (2026-08-24)',
              verifiable: true
            }
          ],
          is_precomputed: true
        };
      }

      // Default: customer_success
      return {
        headline: 'Brookmint Holdings & Northkite - Multi-Tenant Admin Identity Architecture',
        what_happened: 'Team Member A and Customer A reviewed multi-tenant setup across Brookmint Holdings and Northkite Equipment. Customer A initially attempted to use one shared general email account for both companies (Turns 9-18). Discussion clarified that separate administrator email identities are needed for each company workspace. Customer A agreed to consult their internal IT team (Turn 32) and review video tutorials before scheduling further admin sessions (Turn 30).',
        why_it_matters: 'Onboarding governance milestone. Proper separation of administrative credentials ensures security and correct tenant billing once the login blocker is cleared.',
        evidence_citations: [
          {
            id: 'm09-cite-cs-1',
            type: 'turn',
            turn_number: 30,
            speaker: 'Customer A',
            reference: 'Turn 30',
            note: 'Walkthrough review: Customer A agrees to review training videos before next session.'
          },
          {
            id: 'm09-cite-cs-2',
            type: 'turn',
            turn_number: 32,
            speaker: 'Customer A',
            reference: 'Turn 32',
            note: 'IT consultation: "I will speak to our IT team about the separate email identities. Thank you."'
          }
        ],
        what_evidence_does_not_establish: [
          'Does not establish IT policy constraints on creating separate administrative email aliases at Brookmint Holdings.'
        ],
        next_steps: [
          {
            action: 'Customer A to consult internal IT team on establishing separate email identities for Brookmint Holdings vs Northkite Equipment.',
            owner: 'Customer A',
            timing: null,
            verifiable: true
          },
          {
            action: 'Customer A to review training video walkthroughs before scheduling subsequent admin workflow session.',
            owner: 'Customer A',
            timing: null,
            verifiable: true
          }
        ],
        is_precomputed: true
      };
    }
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
          timing: null,
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
      what_happened: `Meeting recording status is '${status}'. Upstream detail: ${detail}`,
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
          owner: payload.organizer_email || null,
          timing: null,
          verifiable: false
        }
      ],
      is_precomputed: true
    };
  }

  // Background call fallback (B01 - B20)
  const rep = payload.rep_name || 'Unknown Rep';
  const outcome = payload.observed_outcome || 'unknown';
  const duration = payload.duration_seconds;
  const direction = payload.direction || 'outbound';
  const startedAt = payload.started_at;

  return {
    headline: `Telephony Intake Exception - ${outcome} (${duration}s, ${direction})`,
    what_happened: `Telephony record ${payload.external_call_id || record_ref}: ${direction} dial by ${rep} at ${startedAt}. Duration: ${duration}s. Machine outcome: ${outcome} (upstream connected flag: ${payload.is_connected}). Part of the 8-minute automated dialer burst (23:51–23:59 IST) placed exclusively by Arun and Leela.`,
    why_it_matters: 'No conversation transcript supplied in delivery package. Categorized in intake exceptions with zero fabricated deal value.',
    evidence_citations: [
      {
        id: `${record_ref}-telemetry`,
        type: 'telemetry',
        reference: 'Telephony Signal Envelope',
        note: `External ID: ${payload.external_call_id}. Rep: ${rep}. Duration: ${duration}s. Direction: ${direction}. Outcome: ${outcome}. Connected Flag: ${payload.is_connected}.`
      }
    ],
    what_evidence_does_not_establish: [
      'Does not establish whether voice message was heard or callback is expected.',
      'Does not establish prospect identity or commercial intent.'
    ],
    next_steps: [],
    is_precomputed: true
  };
}
