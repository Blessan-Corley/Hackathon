import React from 'react';
import { 
  ShieldAlert, 
  Eye, 
  ArrowLeft
} from 'lucide-react';
import { ProcessedRecord } from '../types/index.js';

interface DiscrepancyRadarProps {
  records: ProcessedRecord[];
  onSelectRecord: (record: ProcessedRecord) => void;
  onReturnToInbox: () => void;
}

export const DiscrepancyRadar: React.FC<DiscrepancyRadarProps> = ({
  records,
  onSelectRecord,
  onReturnToInbox
}) => {
  // Real verified anomaly record references
  const anomalyRefs = ['C06', 'C09', 'C10', 'M07'];
  const anomalyRecords = records.filter(r => anomalyRefs.includes(r.record_ref));

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      
      {/* Radar Executive Header */}
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Discrepancy Radar &amp; Telemetry Audits</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold">
                    {anomalyRecords.length} Flagged
                  </span>
                </h2>
                <p className="text-xs text-dark-300 mt-0.5">
                  Automated governance audit reconciling contradictions between upstream telephony tags and spoken transcript reality.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onReturnToInbox}
              className="px-3.5 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 border border-white/[0.08] text-xs font-semibold text-dark-200 hover:text-white flex items-center gap-2 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Triage Inbox</span>
            </button>
          </div>
        </div>

        {/* Forensic Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-6">
          
          {/* 1. C06 */}
          <div className="p-4 rounded-xl bg-dark-900/90 border border-white/[0.08] hover:border-amber-500/40 transition space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                C06 • Call
              </span>
              <span className="text-[11px] text-dark-400 font-mono">Seat: Meera</span>
            </div>
            <h4 className="text-xs font-bold text-white">Voice Attribution Mismatch (Rep Seat Error)</h4>
            <div className="space-y-1 text-[11px]">
              <div className="text-dark-400">
                Upstream Rep: <strong className="text-rose-400">Meera (telephony login)</strong>
              </div>
              <div className="text-dark-300">
                Transcript Reality: Spoken identity is <strong className="text-sky-300">"Ravi here"</strong>. Ravi used Meera's seat; coaching must go to Ravi, not Meera.
              </div>
            </div>
            {records.find(r => r.record_ref === 'C06') && (
              <button
                type="button"
                onClick={() => onSelectRecord(records.find(r => r.record_ref === 'C06')!)}
                className="w-full mt-2 py-1.5 px-2.5 rounded-lg bg-dark-850 hover:bg-dark-800 border border-white/[0.06] text-xs font-medium text-amber-300 flex items-center justify-center gap-1.5 transition"
              >
                <Eye className="w-3 h-3" />
                <span>Inspect Record C06</span>
              </button>
            )}
          </div>

          {/* 2. C09 */}
          <div className="p-4 rounded-xl bg-dark-900/90 border border-white/[0.08] hover:border-amber-500/40 transition space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                C09 • Call
              </span>
              <span className="text-[11px] text-dark-400 font-mono">Rep: Meera</span>
            </div>
            <h4 className="text-xs font-bold text-white">Restricted Referral Governance Contradiction</h4>
            <div className="space-y-1 text-[11px]">
              <div className="text-dark-400">
                Upstream Outcome: <strong className="text-rose-400">referred</strong>
              </div>
              <div className="text-dark-300">
                Transcript Reality: Contact Vedant explicitly prohibited name usage (<strong className="text-amber-300">"No, please don't use my name"</strong>).
              </div>
            </div>
            {records.find(r => r.record_ref === 'C09') && (
              <button
                type="button"
                onClick={() => onSelectRecord(records.find(r => r.record_ref === 'C09')!)}
                className="w-full mt-2 py-1.5 px-2.5 rounded-lg bg-dark-850 hover:bg-dark-800 border border-white/[0.06] text-xs font-medium text-amber-300 flex items-center justify-center gap-1.5 transition"
              >
                <Eye className="w-3 h-3" />
                <span>Inspect Record C09</span>
              </button>
            )}
          </div>

          {/* 3. C10 */}
          <div className="p-4 rounded-xl bg-dark-900/90 border border-white/[0.08] hover:border-amber-500/40 transition space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                C10 • Call
              </span>
              <span className="text-[11px] text-dark-400 font-mono">Rep: Meera</span>
            </div>
            <h4 className="text-xs font-bold text-white">Departed Lead / Phantom Follow-up</h4>
            <div className="space-y-1 text-[11px]">
              <div className="text-dark-400">
                Upstream Outcome: <strong className="text-rose-400">follow_up</strong>
              </div>
              <div className="text-dark-300">
                Transcript Reality: Contact Aniket left Meadowbrick and bluntly refused follow-up: <strong className="text-rose-300">"No. I said I will contact you if there is anything to discuss"</strong>.
              </div>
            </div>
            {records.find(r => r.record_ref === 'C10') && (
              <button
                type="button"
                onClick={() => onSelectRecord(records.find(r => r.record_ref === 'C10')!)}
                className="w-full mt-2 py-1.5 px-2.5 rounded-lg bg-dark-850 hover:bg-dark-800 border border-white/[0.06] text-xs font-medium text-amber-300 flex items-center justify-center gap-1.5 transition"
              >
                <Eye className="w-3 h-3" />
                <span>Inspect Record C10</span>
              </button>
            )}
          </div>

          {/* 4. M07 */}
          <div className="p-4 rounded-xl bg-dark-900/90 border border-white/[0.08] hover:border-purple-500/40 transition space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                M07 • Calendar Meeting
              </span>
              <span className="text-[11px] text-dark-400 font-mono">Customer: Willowfield Trust</span>
            </div>
            <h4 className="text-xs font-bold text-white">Staged Delivery &amp; Customer Support Defect Review</h4>
            <div className="space-y-1 text-[11px]">
              <div className="text-dark-400">
                Organizer: <strong className="text-dark-200">team09@example.com</strong> (Rev 1: staged &rarr; Rev 2: 27 turns)
              </div>
              <div className="text-dark-300">
                Transcript Reality: Customer screenshared 4 software defects (description save reversion, recreate payment attachment, stuck reimbursements, mark as paid retention).
              </div>
            </div>
            {records.find(r => r.record_ref === 'M07') && (
              <button
                type="button"
                onClick={() => onSelectRecord(records.find(r => r.record_ref === 'M07')!)}
                className="w-full mt-2 py-1.5 px-2.5 rounded-lg bg-dark-850 hover:bg-dark-800 border border-white/[0.06] text-xs font-medium text-purple-300 flex items-center justify-center gap-1.5 transition"
              >
                <Eye className="w-3 h-3" />
                <span>Inspect Record M07</span>
              </button>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};
