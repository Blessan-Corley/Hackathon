import React from 'react';
import { 
  PhoneCall, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  ChevronRight,
  ShieldAlert,
  Mic,
  Clock
} from 'lucide-react';
import { ProcessedRecord, RouteCategory, ReviewState, CallPayload, MeetingPayload } from '../types/index.js';
import { ReviewStateDropdown } from './ReviewStateDropdown.js';

interface TriageInboxProps {
  records: ProcessedRecord[];
  selectedRecordId: string | null;
  onSelectRecord: (record: ProcessedRecord) => void;
  onUpdateReviewState: (record: ProcessedRecord, state: ReviewState) => void;
}

const ROUTE_THEMES: Record<RouteCategory, { label: string; badge: string }> = {
  deal_next_steps: { label: 'Deal Next Steps', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  sales_coaching: { label: 'Sales Coaching', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  customer_success: { label: 'Customer Success', badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  customer_support: { label: 'Customer Support', badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  partnerships: { label: 'Partnerships', badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  internal_ops: { label: 'Internal Ops', badge: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' },
  intake_exception: { label: 'Intake Exception', badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20' }
};

export const TriageInbox: React.FC<TriageInboxProps> = ({
  records,
  selectedRecordId,
  onSelectRecord,
  onUpdateReviewState
}) => {
  if (records.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center text-dark-400">
        <FileText className="w-8 h-8 mx-auto text-dark-500 mb-2" />
        <h4 className="text-white font-medium mb-1">No interactions found</h4>
        <p className="text-xs">Try adjusting your active filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl shadow-xl relative z-10">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/[0.08] bg-dark-900/60 text-[11px] font-semibold uppercase tracking-wider text-dark-400">
              <th className="py-3.5 px-4">Ref</th>
              <th className="py-3.5 px-4">Channel</th>
              <th className="py-3.5 px-4">Account / Conversation</th>
              <th className="py-3.5 px-4">Team Member</th>
              <th className="py-3.5 px-4">Destination</th>
              <th className="py-3.5 px-4">Speech</th>
              <th className="py-3.5 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05] text-xs">
            {records.map((record, index) => {
              const isSelected = selectedRecordId === record.identity;
              const isCall = record.source_type === 'call';
              const p = record.payload as any;
              const activeRoutes = record.manual_routes || record.suggested_routes;
              const discrepancy = record.analysis?.discrepancy;

              const personLabel = isCall 
                ? (p.rep_name || p.rep_email || 'Unassigned') 
                : (p.organizer_email || 'Unassigned');

              const isMismatchedRep = isCall && record.record_ref === 'C06';
              const isLastFewRows = index >= records.length - 3;

              return (
                <tr
                  key={record.identity}
                  onClick={() => onSelectRecord(record)}
                  className={`cursor-pointer transition-all duration-150 group ${
                    isSelected 
                      ? 'bg-emerald-500/[0.08] border-l-2 border-emerald-500' 
                      : 'hover:bg-white/[0.03]'
                  }`}
                >
                  {/* Ref Badge */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-md font-mono text-[11px] font-bold border ${
                        record.record_ref.startsWith('M') 
                          ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300' 
                          : record.record_ref.startsWith('C')
                          ? 'bg-sky-500/10 border-sky-500/30 text-sky-300'
                          : 'bg-dark-800 border-white/[0.06] text-dark-400'
                      }`}>
                        {record.record_ref}
                      </span>
                      {record.current_revision > 1 && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          v{record.current_revision}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Channel Icon */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="flex items-center gap-1.5 text-dark-300 text-xs font-medium">
                      {isCall ? (
                        <>
                          <PhoneCall className="w-3.5 h-3.5 text-sky-400" />
                          <span>Call</span>
                        </>
                      ) : (
                        <>
                          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Meeting</span>
                        </>
                      )}
                    </span>
                  </td>

                  {/* Headline & Discrepancy */}
                  <td className="py-3.5 px-4 min-w-[280px] max-w-[440px]">
                    <div className="font-semibold text-white group-hover:text-emerald-400 transition line-clamp-1 text-xs">
                      {record.analysis?.headline || (record.payload as MeetingPayload).title || 'Interaction'}
                    </div>

                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {/* Upstream Discrepancy Alert Tag */}
                      {discrepancy && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/25 font-medium">
                          <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>{discrepancy.field === 'rep_name' ? 'Attribution Conflict' : 'Outcome Discrepancy'}</span>
                        </span>
                      )}

                      {/* Manual Override Tag */}
                      {record.is_manually_corrected && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] bg-sky-500/10 text-sky-300 border border-sky-500/25 font-medium">
                          <CheckCircle2 className="w-3 h-3 text-sky-400" />
                          <span>Manual Override</span>
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Team Member */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="text-dark-200 font-medium">
                      {personLabel}
                    </div>
                    {isMismatchedRep && (
                      <div className="text-[10px] text-amber-400 font-medium">
                        Spoke: Ravi
                      </div>
                    )}
                    <div className="text-[11px] text-dark-400 mt-0.5">
                      {p.duration_seconds}s
                    </div>
                  </td>

                  {/* Route Destinations */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {activeRoutes.map((route) => {
                        const theme = ROUTE_THEMES[route] || { label: route, badge: 'bg-dark-800 text-dark-300 border-white/[0.08]' };
                        return (
                          <span
                            key={route}
                            className={`px-2 py-0.5 rounded-md text-[11px] font-medium border whitespace-nowrap ${theme.badge}`}
                          >
                            {theme.label}
                          </span>
                        );
                      })}
                    </div>
                  </td>

                  {/* Speech / Turns */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {record.has_usable_text ? (
                      <div className="flex items-center gap-1 text-emerald-400 font-medium text-xs">
                        <FileText className="w-3.5 h-3.5" />
                        <span>
                          {isCall ? 'Transcript' : `${record.transcript_payload?.turns?.length || 0} turns`}
                        </span>
                      </div>
                    ) : (
                      <span className="text-dark-500 text-xs">
                        {isCall ? 'Telephony' : '0 turns'}
                      </span>
                    )}
                  </td>

                  {/* Status Custom Dropdown */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-right">
                    <ReviewStateDropdown
                      value={record.review_state}
                      onChange={(newState) => onUpdateReviewState(record, newState)}
                      isLastFewRows={isLastFewRows}
                    />
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
