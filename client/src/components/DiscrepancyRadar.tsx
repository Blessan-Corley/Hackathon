import React from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Eye, 
  ArrowLeft, 
  Sparkles,
  PhoneCall,
  Calendar,
  Layers
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
  // Anomaly record references
  const anomalyRefs = ['C04', 'C06', 'C09', 'C10', 'M07'];
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
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold animate-pulse">
                    {anomalyRecords.length} Flagged
                  </span>
                </h2>
                <p className="text-xs text-dark-300 mt-0.5">
                  Automated governance engine reconciling contradictions between upstream telephony tags and transcript reality.
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          
          {/* 1. C04 */}
          <div className="p-4 rounded-xl bg-dark-900/90 border border-white/[0.08] hover:border-amber-500/40 transition space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                C04 • Call
              </span>
              <span className="text-[11px] text-dark-400 font-mono">Rep: Arun</span>
            </div>
            <h4 className="text-xs font-bold text-white">Connection False Negative</h4>
            <div className="space-y-1 text-[11px]">
              <div className="text-dark-400">
                Upstream Tag: <strong className="text-rose-400">is_connected: false</strong>
              </div>
              <div className="text-dark-300">
                Transcript Reality: <strong className="text-emerald-300">Arun spoke 95s</strong> through automated IVR and recorded voicemail.
              </div>
            </div>
            {records.find(r => r.record_ref === 'C04') && (
              <button
                type="button"
                onClick={() => onSelectRecord(records.find(r => r.record_ref === 'C04')!)}
                className="w-full mt-2 py-1.5 px-2.5 rounded-lg bg-dark-850 hover:bg-dark-800 border border-white/[0.06] text-xs font-medium text-amber-300 flex items-center justify-center gap-1.5 transition"
              >
                <Eye className="w-3 h-3" />
                <span>Inspect Record C04</span>
              </button>
            )}
          </div>

          {/* 2. C06 */}
          <div className="p-4 rounded-xl bg-dark-900/90 border border-white/[0.08] hover:border-amber-500/40 transition space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                C06 • Call
              </span>
              <span className="text-[11px] text-dark-400 font-mono">Seat: Meera</span>
            </div>
            <h4 className="text-xs font-bold text-white">Voice Attribution Mismatch</h4>
            <div className="space-y-1 text-[11px]">
              <div className="text-dark-400">
                Upstream Rep: <strong className="text-rose-400">Meera (telephony login)</strong>
              </div>
              <div className="text-dark-300">
                Transcript Reality: <strong className="text-sky-300">"Ravi here"</strong>. Ravi used Meera's telephony seat to discuss payment gateway bugs.
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

          {/* 3. C09 */}
          <div className="p-4 rounded-xl bg-dark-900/90 border border-white/[0.08] hover:border-amber-500/40 transition space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                C09 • Call
              </span>
              <span className="text-[11px] text-dark-400 font-mono">Rep: Arun</span>
            </div>
            <h4 className="text-xs font-bold text-white">Referral Permission Contradiction</h4>
            <div className="space-y-1 text-[11px]">
              <div className="text-dark-400">
                Upstream Outcome: <strong className="text-rose-400">referred</strong>
              </div>
              <div className="text-dark-300">
                Transcript Reality: Contact strictly forbade name usage (<strong className="text-amber-300">"No, please don't use my name"</strong>).
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

          {/* 4. C10 */}
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
                Transcript Reality: Contact Aniket left Meadowbrick: <strong className="text-rose-300">"No. I said I will contact you if needed"</strong>.
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

          {/* 5. M07 */}
          <div className="p-4 rounded-xl bg-dark-900/90 border border-white/[0.08] hover:border-purple-500/40 transition space-y-2.5 md:col-span-2 lg:col-span-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                M07 • Calendar Meeting
              </span>
              <span className="text-[11px] text-dark-400 font-mono">Customer: StoreHarbor</span>
            </div>
            <h4 className="text-xs font-bold text-white">Revision Replacement &amp; Data Loss Prevention</h4>
            <div className="space-y-1 text-[11px]">
              <div className="text-dark-400">
                Revision Lifecycle: <strong className="text-amber-300">v1 (no transcript) &rarr; v2 (delivered with bug evidence)</strong>
              </div>
              <div className="text-dark-300">
                Transcript Reality: Customer screenshared critical defect: changing event-payment description does not persist after clicking save.
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
