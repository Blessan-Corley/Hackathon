import React from 'react';
import { 
  PhoneCall, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Sparkles,
  FileText,
  UserCheck,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { ProcessedRecord, RouteCategory, ReviewState, CallPayload, MeetingPayload } from '../types/index.js';

interface TriageInboxProps {
  records: ProcessedRecord[];
  selectedRecordId: string | null;
  onSelectRecord: (record: ProcessedRecord) => void;
  onUpdateReviewState: (record: ProcessedRecord, state: ReviewState) => void;
}

const ROUTE_LABELS: Record<RouteCategory, { label: string; color: string }> = {
  deal_next_steps: { label: 'Deal Next Steps', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  sales_coaching: { label: 'Sales Coaching', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  customer_success: { label: 'Customer Success', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  customer_support: { label: 'Customer Support', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  partnerships: { label: 'Partnerships', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  internal_ops: { label: 'Internal Ops', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
  intake_exception: { label: 'Intake Exception', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' }
};

export const TriageInbox: React.FC<TriageInboxProps> = ({
  records,
  selectedRecordId,
  onSelectRecord,
  onUpdateReviewState
}) => {
  if (records.length === 0) {
    return (
      <div className="bg-obsidian-900 border border-obsidian-800 rounded-lg p-12 text-center text-obsidian-400">
        <FileText className="w-8 h-8 mx-auto text-obsidian-600 mb-2" />
        <h4 className="text-white font-medium mb-1">No matching records found</h4>
        <p className="text-xs">Adjust your active filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className="bg-obsidian-900 border border-obsidian-800 rounded-lg overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-obsidian-800 bg-obsidian-850/60 text-[11px] font-mono uppercase tracking-wider text-obsidian-400">
              <th className="py-2.5 px-3">Ref</th>
              <th className="py-2.5 px-3">Type</th>
              <th className="py-2.5 px-3">Summary / Headline</th>
              <th className="py-2.5 px-3">Rep / Context</th>
              <th className="py-2.5 px-3">Active Route(s)</th>
              <th className="py-2.5 px-3">Evidence</th>
              <th className="py-2.5 px-3 text-right">Review State</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-obsidian-800/60 text-xs">
            {records.map((record) => {
              const isSelected = selectedRecordId === record.identity;
              const isCall = record.source_type === 'call';
              const p = record.payload as any;
              const activeRoutes = record.manual_routes || record.suggested_routes;
              const discrepancy = record.analysis?.discrepancy;

              // Rep or Organizer label
              let personLabel = isCall ? (p.rep_name || p.rep_email || 'Unassigned') : (p.organizer_email || 'Unassigned');
              const isMismatchedRep = isCall && record.record_ref === 'C06';

              return (
                <tr
                  key={record.identity}
                  onClick={() => onSelectRecord(record)}
                  className={`cursor-pointer transition group ${
                    isSelected 
                      ? 'bg-emerald-500/10 border-l-2 border-emerald-500' 
                      : 'hover:bg-obsidian-850/80'
                  }`}
                >
                  {/* Record Ref Badge */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold border ${
                        record.record_ref.startsWith('M') 
                          ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300' 
                          : record.record_ref.startsWith('C')
                          ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                          : 'bg-obsidian-800 border-obsidian-700 text-obsidian-400'
                      }`}>
                        {record.record_ref}
                      </span>
                      {record.current_revision > 1 && (
                        <span className="px-1 py-0.2 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          Rev {record.current_revision}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Type Icon */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="flex items-center gap-1 text-obsidian-300 font-mono text-[11px]">
                      {isCall ? (
                        <>
                          <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
                          <span>call</span>
                        </>
                      ) : (
                        <>
                          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                          <span>meeting</span>
                        </>
                      )}
                    </span>
                  </td>

                  {/* Summary / Headline & Discrepancies */}
                  <td className="py-3 px-3 min-w-[280px] max-w-[420px]">
                    <div className="font-semibold text-white group-hover:text-emerald-300 transition line-clamp-1">
                      {record.analysis?.headline || (record.payload as MeetingPayload).title || 'Conversation Record'}
                    </div>

                    {/* Discrepancy Alert Tag */}
                    {discrepancy && (
                      <div className="mt-1 flex items-center gap-1.5 text-[10px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded w-fit">
                        <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                        <span className="truncate">
                          Metadata: {discrepancy.upstream_claim} vs Spoken: {discrepancy.field === 'rep_name' ? 'Ravi' : 'Refusal'}
                        </span>
                      </div>
                    )}

                    {/* Manual Override Flag */}
                    {record.is_manually_corrected && (
                      <div className="mt-1 flex items-center gap-1 text-[10px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-1.5 py-0.5 rounded w-fit">
                        <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span>Manual Route Override Applied</span>
                      </div>
                    )}
                  </td>

                  {/* Person & Context */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="text-obsidian-200 font-medium">
                      {personLabel}
                    </div>
                    {isMismatchedRep && (
                      <div className="text-[10px] font-mono text-amber-400 flex items-center gap-1">
                        <span>Spoke: <strong>Ravi</strong></span>
                      </div>
                    )}
                    <div className="text-[11px] text-obsidian-400 font-mono">
                      {p.duration_seconds}s
                    </div>
                  </td>

                  {/* Route Taxonomy Badges */}
                  <td className="py-3 px-3">
                    <div className="flex flex-wrap gap-1">
                      {activeRoutes.map((route) => {
                        const style = ROUTE_LABELS[route] || { label: route, color: 'bg-obsidian-800 text-obsidian-300 border-obsidian-700' };
                        return (
                          <span
                            key={route}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono border whitespace-nowrap ${style.color}`}
                          >
                            {style.label}
                          </span>
                        );
                      })}
                    </div>
                  </td>

                  {/* Evidence / Turns Badge */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    {record.has_usable_text ? (
                      <div className="flex items-center gap-1 text-emerald-400 font-mono text-[11px]">
                        <FileText className="w-3.5 h-3.5" />
                        <span>
                          {isCall 
                            ? 'Transcript' 
                            : `${record.transcript_payload?.turns?.length || 0} turns`}
                        </span>
                      </div>
                    ) : (
                      <span className="text-obsidian-500 font-mono text-[11px]">
                        {isCall ? 'Telephony' : '0 turns'}
                      </span>
                    )}
                  </td>

                  {/* Review State Dropdown */}
                  <td className="py-3 px-3 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={record.review_state}
                      onChange={(e) => onUpdateReviewState(record, e.target.value as ReviewState)}
                      className={`text-[11px] font-mono font-medium rounded px-2 py-0.5 border focus:outline-none ${
                        record.review_state === 'reviewed'
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : record.review_state === 'pending_re-review'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : 'bg-obsidian-850 text-obsidian-300 border-obsidian-750'
                      }`}
                    >
                      <option value="unreviewed">Unreviewed</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="pending_re-review">Needs Re-review</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
