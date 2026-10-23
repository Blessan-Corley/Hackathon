import React from 'react';
import { X, Calendar, MapPin, AlertOctagon, CheckCircle2, ChevronRight, FileText, ArrowRight } from 'lucide-react';

interface ManagerBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInspectRecordRef: (recordRef: string) => void;
}

export const ManagerBriefModal: React.FC<ManagerBriefModalProps> = ({
  isOpen,
  onClose,
  onInspectRecordRef
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-obsidian-900 border border-obsidian-750 rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-obsidian-800 bg-obsidian-850 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                SpendNest Revenue Intelligence — Manager Daily Brief
              </h3>
              <div className="flex items-center gap-3 text-xs text-obsidian-400 font-mono mt-0.5">
                <span>21 August 2026</span>
                <span>•</span>
                <span>Asia/Kolkata</span>
                <span>•</span>
                <span className="text-emerald-400">Final Post-Update Synthesis (18 Conversations Evaluated)</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-obsidian-400 hover:text-white hover:bg-obsidian-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-obsidian-200 leading-relaxed font-sans">
          
          {/* Executive Summary */}
          <section className="p-4 rounded-lg bg-obsidian-850 border border-obsidian-800 space-y-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-emerald-400">
              Executive Activity &amp; Risk Overview
            </h4>
            <p>
              On 21 August 2026, the team completed 44 total interactions (30 phone dials and 14 scheduled meetings). 
              Across these, <strong>18 contain verified conversational dialogue</strong> (10 calls and 8 meetings post-update). 
              The remaining 26 records represent telephony screening drops, unreached voicemails, or silent/cancelled recordings.
            </p>
            <p>
              Crucially, <strong>three critical telemetry and classification errors were detected</strong> in upstream metadata that, if uncorrected, would lead reps to harass departed contacts, coach the wrong representatives, or miss severe software defects.
            </p>
          </section>

          {/* Section 1: Urgent Alerts & Forensic Findings */}
          <section className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 text-amber-400">
              <AlertOctagon className="w-4 h-4" />
              1. Urgent Forensic Findings Linked to Evidence
            </h4>

            <div className="space-y-2.5">
              
              {/* Finding A: C10 */}
              <div className="p-3.5 rounded-lg bg-obsidian-850 border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/30">C10</span>
                    <span>The Phantom Follow-up on Departed Contact</span>
                  </div>
                  <button
                    onClick={() => { onClose(); onInspectRecordRef('C10'); }}
                    className="text-amber-400 hover:text-amber-300 font-mono text-[11px] flex items-center gap-1"
                  >
                    Inspect C10 &rarr;
                  </button>
                </div>
                <blockquote className="p-2 rounded bg-obsidian-900 border-l-2 border-amber-400 text-obsidian-100 font-mono text-[11px]">
                  "Are you calling about Meadowbrick? Yes, that's right. I don't work there anymore... Would a follow-up call on Monday or Tuesday next week be okay... ? No. I said I will contact you if there is anything to discuss."
                </blockquote>
                <p className="text-obsidian-300">
                  <strong className="text-white">Manager Action:</strong> Upstream metadata tagged this call <code className="text-amber-300">observed_outcome: follow_up</code>. Rep Meera must immediately cancel all follow-up tasks to Aniket to prevent lead fatigue. Meadowbrick account must be re-prospected from scratch.
                </p>
              </div>

              {/* Finding B: M07 */}
              <div className="p-3.5 rounded-lg bg-obsidian-850 border border-purple-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded font-mono text-indigo-300 bg-indigo-500/10 border border-indigo-500/30">M07</span>
                    <span>Customer Defect Escalation: Payment Description Persistence</span>
                  </div>
                  <button
                    onClick={() => { onClose(); onInspectRecordRef('M07'); }}
                    className="text-purple-400 hover:text-purple-300 font-mono text-[11px] flex items-center gap-1"
                  >
                    Inspect M07 &rarr;
                  </button>
                </div>
                <blockquote className="p-2 rounded bg-obsidian-900 border-l-2 border-purple-400 text-obsidian-100 font-mono text-[11px]">
                  Turn 2: Customer A shares screen demonstrating that editing event-payment description reverts to earlier wording upon clicking save.
                </blockquote>
                <p className="text-obsidian-300">
                  <strong className="text-white">Manager Action:</strong> This is a product data-loss defect. Routed immediately to Customer Support &amp; Engineering. Team Member A must follow up with engineering confirmation by 2026-08-22.
                </p>
              </div>

              {/* Finding C: C06 */}
              <div className="p-3.5 rounded-lg bg-obsidian-850 border border-blue-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/30">C06</span>
                    <span>Rep Attribution Mismatch in Telephony Metadata</span>
                  </div>
                  <button
                    onClick={() => { onClose(); onInspectRecordRef('C06'); }}
                    className="text-blue-400 hover:text-blue-300 font-mono text-[11px] flex items-center gap-1"
                  >
                    Inspect C06 &rarr;
                  </button>
                </div>
                <blockquote className="p-2 rounded bg-obsidian-900 border-l-2 border-blue-400 text-obsidian-100 font-mono text-[11px]">
                  "Good evening. Ravi here. I'll say at the start that this is a cold call."
                </blockquote>
                <p className="text-obsidian-300">
                  <strong className="text-white">Manager Action:</strong> Upstream CRM metadata recorded caller as <code className="text-blue-300">rep_name: Meera</code>. Operations must reassign telephony seats. Coaching on this 120-store retail pitch belongs to Ravi.
                </p>
              </div>

            </div>
          </section>

          {/* Section 2: Pipeline Next Steps & Acceleration */}
          <section className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-emerald-400">
              2. Deal Next Steps &amp; Qualification
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-obsidian-850 border border-obsidian-800 space-y-1.5">
                <div className="font-semibold text-white flex items-center justify-between">
                  <span>Asterloom Systems (M03)</span>
                  <span className="text-emerald-400 font-mono">High Potential</span>
                </div>
                <p className="text-obsidian-300">
                  Customer B demands written materials first for internal CFO review before any future calls (Turn 36). Send CFO accounting reconciliation whitepaper; hold follow-up calls until review completes.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-obsidian-850 border border-obsidian-800 space-y-1.5">
                <div className="font-semibold text-white flex items-center justify-between">
                  <span>Milan / API Webhooks (C03)</span>
                  <span className="text-cyan-400 font-mono">Agreed Follow-up</span>
                </div>
                <p className="text-obsidian-300">
                  Kiran agreed on email subject <em>"Developer access and event notifications — follow-up"</em> and follow-up call Monday/Tuesday.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-obsidian-850 border border-obsidian-800 space-y-1.5">
                <div className="font-semibold text-white flex items-center justify-between">
                  <span>Raghav / People Ops (C08)</span>
                  <span className="text-emerald-400 font-mono">Executive Referral</span>
                </div>
                <p className="text-obsidian-300">
                  Authorized introduction to people ops head (<code className="text-obsidian-200">contact08@example.com</code>). Meera authorized to state Raghav referred her.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-obsidian-850 border border-obsidian-800 space-y-1.5">
                <div className="font-semibold text-white flex items-center justify-between">
                  <span>StoreHarbor Battlecard (C05)</span>
                  <span className="text-amber-400 font-mono">Competitive</span>
                </div>
                <p className="text-obsidian-300">
                  Identified key competitor StoreHarbor. Send comparative presentation highlighting SpendNest approval controls.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Channel Partnerships */}
          <section className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-cyan-400">
              3. Channel &amp; Referral Partnerships
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-obsidian-850 border border-obsidian-800 space-y-1">
                <div className="font-semibold text-white">Harborpath Advisory (M01)</div>
                <p className="text-obsidian-300">
                  Offshore corporate incorporation advisory firm. Send virtual account corporate onboarding specification sheet.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-obsidian-850 border border-obsidian-800 space-y-1">
                <div className="font-semibold text-white">Willowbank Advisory (C07)</div>
                <p className="text-obsidian-300">
                  Dev agreed to send proposal deck via chat app and follow up Monday regarding virtual account client referrals.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Non-Sales Separation */}
          <section className="p-4 rounded-lg bg-obsidian-850 border border-obsidian-800 space-y-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-indigo-400">
              4. Non-Sales Conversations Kept Out of Pipeline
            </h4>
            <ul className="list-disc list-inside space-y-1 text-obsidian-300">
              <li><strong className="text-white">M10 (Billing workflow walkthrough):</strong> 100% internal staff training session on subscription billing. Kept out of sales activity metrics.</li>
              <li><strong className="text-white">M02 (LedgerBridge):</strong> E-invoicing vendor supplier pitching technical API integration. Routed to Product Engineering.</li>
              <li><strong className="text-white">M04 (Cedarwave Distribution):</strong> Customer success card migration review regarding fuel merchant acceptance declines.</li>
            </ul>
          </section>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-obsidian-800 bg-obsidian-850 flex items-center justify-between">
          <span className="text-xs text-obsidian-400 font-mono">
            SpendNest Revenue Intelligence Engine • Fixed Date Brief
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-obsidian-800 hover:bg-obsidian-750 text-xs font-medium text-white transition"
          >
            Close Brief
          </button>
        </div>

      </div>
    </div>
  );
};
