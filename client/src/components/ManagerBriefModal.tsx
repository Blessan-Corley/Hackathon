import React from 'react';
import { 
  X, 
  Calendar, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  ArrowUpRight,
  ShieldAlert,
  ArrowRight,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';

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
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-dark-900 border border-white/[0.10] rounded-2xl max-w-3xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-white/[0.08] bg-dark-850/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Manager Daily Briefing
              </h3>
              <div className="flex items-center gap-2 text-xs text-dark-400 mt-0.5">
                <span>Friday, August 21, 2026</span>
                <span>•</span>
                <span>Asia/Kolkata</span>
                <span>•</span>
                <span className="text-emerald-400 font-medium">18 Verified Conversations</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-dark-300 leading-relaxed custom-scrollbar">
          
          {/* Executive Overview Card */}
          <div className="p-4 rounded-xl bg-dark-850/80 border border-white/[0.08] space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Activity &amp; Risk Synthesis</span>
            </div>
            <p className="text-xs leading-relaxed text-dark-200">
              The team logged 44 total interactions (30 calls and 14 scheduled meetings). 
              Across these, <strong>18 contain verified conversational dialogue</strong> (10 calls and 8 meetings post-update). 
              The remaining 26 records represent telephony screening drops, unreached voicemails, or silent recordings.
            </p>
            <p className="text-xs leading-relaxed text-dark-300">
              Three critical telemetry discrepancies were uncovered and corrected by the intelligence layer to protect pipeline hygiene.
            </p>
          </div>

          {/* Section 1: Critical Telemetry Discrepancies */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                <span>Critical Anomalies Requiring Intervention</span>
              </h4>
              <span className="text-[11px] text-dark-400">3 Flagged</span>
            </div>

            <div className="space-y-3">
              
              {/* C10 Card */}
              <div className="p-4 rounded-xl bg-dark-850 border border-amber-500/20 hover:border-amber-500/40 transition space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        C10
                      </span>
                      <h5 className="text-sm font-semibold text-white">
                        Phantom Follow-up on Departed Lead
                      </h5>
                    </div>
                    <p className="text-xs text-dark-400 mt-1">
                      Rep Meera • Contact: Aniket (Meadowbrick)
                    </p>
                  </div>
                  <button
                    onClick={() => { onClose(); onInspectRecordRef('C10'); }}
                    className="text-xs font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1 group shrink-0"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                  </button>
                </div>
                
                <blockquote className="p-3 rounded-lg bg-dark-900 border-l-2 border-amber-400 text-xs font-mono text-dark-200 leading-relaxed">
                  "Are you calling about Meadowbrick? Yes... I don't work there anymore... Would a follow-up call next week be okay? No. I said I will contact you if there is anything to discuss."
                </blockquote>

                <p className="text-xs text-dark-300">
                  <span className="text-white font-medium">Resolution:</span> Upstream CRM tagged this as <code className="text-amber-300 px-1 py-0.5 bg-dark-900 rounded font-mono text-[11px]">follow_up</code>. Cancelled scheduled tasks immediately. Re-assigned account research for new decision maker.
                </p>
              </div>

              {/* M07 Card */}
              <div className="p-4 rounded-xl bg-dark-850 border border-purple-500/20 hover:border-purple-500/40 transition space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        M07
                      </span>
                      <h5 className="text-sm font-semibold text-white">
                        Data Loss Defect: Event Payment Persistence
                      </h5>
                    </div>
                    <p className="text-xs text-dark-400 mt-1">
                      Organizer: team06 • Client: Customer A
                    </p>
                  </div>
                  <button
                    onClick={() => { onClose(); onInspectRecordRef('M07'); }}
                    className="text-xs font-medium text-purple-400 hover:text-purple-300 flex items-center gap-1 group shrink-0"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                  </button>
                </div>
                
                <blockquote className="p-3 rounded-lg bg-dark-900 border-l-2 border-purple-400 text-xs font-mono text-dark-200 leading-relaxed">
                  Turn 2: Customer A shares screen demonstrating that editing event-payment description reverts to earlier wording upon clicking save.
                </blockquote>

                <p className="text-xs text-dark-300">
                  <span className="text-white font-medium">Resolution:</span> Ingested via v2 update with 27 full dialogue turns. Routed directly to Customer Support &amp; Engineering SLA queue.
                </p>
              </div>

              {/* C06 Card */}
              <div className="p-4 rounded-xl bg-dark-850 border border-blue-500/20 hover:border-blue-500/40 transition space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        C06
                      </span>
                      <h5 className="text-sm font-semibold text-white">
                        Telephony Attribution Mismatch
                      </h5>
                    </div>
                    <p className="text-xs text-dark-400 mt-1">
                      CRM Assigned: Meera • Actual Voice: Ravi
                    </p>
                  </div>
                  <button
                    onClick={() => { onClose(); onInspectRecordRef('C06'); }}
                    className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 group shrink-0"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                  </button>
                </div>
                
                <blockquote className="p-3 rounded-lg bg-dark-900 border-l-2 border-blue-400 text-xs font-mono text-dark-200 leading-relaxed">
                  "Good evening. Ravi here. I'll say at the start that this is a cold call."
                </blockquote>

                <p className="text-xs text-dark-300">
                  <span className="text-white font-medium">Resolution:</span> Softphone profile reassignment required. Coaching on retail multi-location pitches directed to Ravi.
                </p>
              </div>

            </div>
          </div>

          {/* Section 2: Pipeline Acceleration */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Pipeline Opportunities &amp; Clear Next Steps
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-dark-850 border border-white/[0.08] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Asterloom Systems (M03)</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                    High Priority
                  </span>
                </div>
                <p className="text-xs text-dark-300 leading-relaxed">
                  Demands CFO accounting reconciliation whitepaper before scheduling next conversation. Hold outbound dials until delivery.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-dark-850 border border-white/[0.08] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">API Webhooks (C03)</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-sky-500/15 text-sky-400 border border-sky-500/20">
                    Agreed Next Step
                  </span>
                </div>
                <p className="text-xs text-dark-300 leading-relaxed">
                  Kiran agreed on developer access &amp; notification docs. Follow-up call booked for early next week.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-dark-850 border border-white/[0.08] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">People Ops Intro (C08)</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                    Executive Referral
                  </span>
                </div>
                <p className="text-xs text-dark-300 leading-relaxed">
                  Authorized introduction to people ops leadership. Meera confirmed permission to reference Raghav as referrer.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-dark-850 border border-white/[0.08] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">StoreHarbor Battlecard (C05)</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/20">
                    Competitive
                  </span>
                </div>
                <p className="text-xs text-dark-300 leading-relaxed">
                  Identified active evaluation against StoreHarbor. Deliver comparative feature brief highlighting multi-tier approval policies.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Partnerships & Non-Sales Routing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-dark-850 border border-white/[0.08] space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Channel &amp; Advisory Partners
              </h5>
              <div className="space-y-2 text-xs text-dark-300">
                <div>
                  <strong className="text-white">Harborpath Advisory (M01):</strong> Offshore corporate firm requesting virtual accounts spec sheet.
                </div>
                <div>
                  <strong className="text-white">Willowbank (C07):</strong> Dev sending proposal deck via chat app for client referrals.
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-dark-850 border border-white/[0.08] space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Non-Sales Exclusions
              </h5>
              <div className="space-y-2 text-xs text-dark-300">
                <div>
                  <strong className="text-white">M10:</strong> Internal billing training session. Excluded from sales activity quota.
                </div>
                <div>
                  <strong className="text-white">M02:</strong> LedgerBridge vendor pitch. Routed to Product Engineering.
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-dark-850/60 flex items-center justify-between">
          <span className="text-xs text-dark-400">
            SpendNest Revenue Intelligence Workspace
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-dark-800 hover:bg-dark-750 text-xs font-semibold text-white transition shadow-sm"
          >
            Close Brief
          </button>
        </div>

      </div>
    </div>
  );
};
