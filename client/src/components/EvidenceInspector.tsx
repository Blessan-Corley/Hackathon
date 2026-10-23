import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  FileText, 
  Clock, 
  Tag, 
  Quote, 
  Calendar, 
  PhoneCall,
  User,
  Check,
  Building,
  Info,
  ArrowRight,
  ListTodo
} from 'lucide-react';
import { ProcessedRecord, RouteCategory, ReviewState, CallPayload, MeetingPayload } from '../types/index.js';
import { ReviewStateDropdown } from './ReviewStateDropdown.js';

interface EvidenceInspectorProps {
  record: ProcessedRecord;
  onClose: () => void;
  onUpdateRoute: (routes: RouteCategory[], reason?: string) => Promise<void>;
  onResetRoute: () => Promise<void>;
  onUpdateReviewState: (state: ReviewState) => Promise<void>;
}

const AVAILABLE_ROUTES: Array<{ 
  id: RouteCategory; 
  label: string; 
  desc: string;
  theme: { bg: string; border: string; text: string; boxBg: string; boxBorder: string };
}> = [
  { 
    id: 'deal_next_steps', 
    label: 'Deal Next Steps', 
    desc: 'Active sales opportunity qualification & pipeline movement',
    theme: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/40', text: 'text-emerald-300', boxBg: 'bg-emerald-500', boxBorder: 'border-emerald-400' }
  },
  { 
    id: 'sales_coaching', 
    label: 'Sales Coaching', 
    desc: 'Rep development, pitch feedback, and objection handling',
    theme: { bg: 'bg-amber-500/10', border: 'border-amber-500/40', text: 'text-amber-300', boxBg: 'bg-amber-500', boxBorder: 'border-amber-400' }
  },
  { 
    id: 'customer_success', 
    label: 'Customer Success', 
    desc: 'Account retention, feature adoption, and program migration',
    theme: { bg: 'bg-blue-500/10', border: 'border-blue-500/40', text: 'text-blue-300', boxBg: 'bg-blue-500', boxBorder: 'border-blue-400' }
  },
  { 
    id: 'customer_support', 
    label: 'Customer Support', 
    desc: 'Technical troubleshooting, bug escalation, and onboarding defects',
    theme: { bg: 'bg-purple-500/10', border: 'border-purple-500/40', text: 'text-purple-300', boxBg: 'bg-purple-500', boxBorder: 'border-purple-400' }
  },
  { 
    id: 'partnerships', 
    label: 'Partnerships', 
    desc: 'Channel referral partnerships and reseller development',
    theme: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/40', text: 'text-cyan-300', boxBg: 'bg-cyan-500', boxBorder: 'border-cyan-400' }
  },
  { 
    id: 'internal_ops', 
    label: 'Internal Operations', 
    desc: 'Internal staff training, vendor contracts, and non-sales admin',
    theme: { bg: 'bg-zinc-500/10', border: 'border-zinc-500/40', text: 'text-zinc-300', boxBg: 'bg-zinc-500', boxBorder: 'border-zinc-400' }
  },
  { 
    id: 'intake_exception', 
    label: 'Intake Exception', 
    desc: 'Unattended calls, silent recordings, or cancelled meetings',
    theme: { bg: 'bg-rose-500/10', border: 'border-rose-500/40', text: 'text-rose-300', boxBg: 'bg-rose-500', boxBorder: 'border-rose-400' }
  }
];

export const EvidenceInspector: React.FC<EvidenceInspectorProps> = ({
  record,
  onClose,
  onUpdateRoute,
  onResetRoute,
  onUpdateReviewState
}) => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'transcript' | 'routing'>('analysis');
  const [highlightedTurn, setHighlightedTurn] = useState<number | null>(null);

  const activeRoutes = record.manual_routes || record.suggested_routes;
  const [selectedRoutes, setSelectedRoutes] = useState<RouteCategory[]>(activeRoutes);
  const [overrideReason, setOverrideReason] = useState<string>(record.manual_override_reason || '');
  const [isSavingRoute, setIsSavingRoute] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const isCall = record.source_type === 'call';
  const callPayload = isCall ? (record.payload as CallPayload) : null;
  const meetingPayload = !isCall ? (record.payload as MeetingPayload) : null;
  const turns = record.transcript_payload?.turns || [];
  const discrepancy = record.analysis?.discrepancy;

  const handleRouteToggle = (routeId: RouteCategory) => {
    if (selectedRoutes.includes(routeId)) {
      if (selectedRoutes.length > 1) {
        setSelectedRoutes(selectedRoutes.filter(r => r !== routeId));
      }
    } else {
      setSelectedRoutes([...selectedRoutes, routeId]);
    }
  };

  const handleSaveOverride = async () => {
    setIsSavingRoute(true);
    setSaveSuccessMsg(null);
    try {
      await onUpdateRoute(selectedRoutes, overrideReason);
      setSaveSuccessMsg('Manual route saved.');
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    } finally {
      setIsSavingRoute(false);
    }
  };

  const handleResetToSuggested = async () => {
    setIsSavingRoute(true);
    try {
      await onResetRoute();
      setSelectedRoutes(record.suggested_routes);
      setOverrideReason('');
      setSaveSuccessMsg('Restored automated recommendation.');
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    } finally {
      setIsSavingRoute(false);
    }
  };

  const handleJumpToCitation = (turnNumber?: number) => {
    if (turnNumber) {
      setHighlightedTurn(turnNumber);
      setActiveTab('transcript');
      setTimeout(() => {
        const el = document.getElementById(`turn-${turnNumber}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } else {
      setActiveTab('transcript');
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-dark-900 border-l border-white/[0.1] shadow-2xl z-40 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
      
      {/* Header Bar */}
      <div className="p-5 border-b border-white/[0.08] bg-dark-850/60 backdrop-blur flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold border ${
              record.record_ref.startsWith('M') 
                ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300' 
                : 'bg-sky-500/10 border-sky-500/30 text-sky-300'
            }`}>
              {record.record_ref}
            </span>
            <span className="text-xs text-dark-400 font-mono">
              Identity: <strong className="text-dark-200">({record.source_type}, {record.source_id.substring(0, 8)})</strong>
            </span>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-dark-800 text-dark-300 border border-white/[0.06]">
              Rev {record.current_revision}
            </span>
          </div>

          <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
            {record.analysis?.headline || meetingPayload?.title || 'Interaction Detail'}
          </h3>

          <div className="flex items-center gap-3 text-xs text-dark-400 mt-1 font-medium">
            {isCall ? (
              <span>Rep: <strong className="text-dark-200">{callPayload?.rep_name || callPayload?.rep_email}</strong></span>
            ) : (
              <span>Host: <strong className="text-dark-200">{meetingPayload?.organizer_email}</strong></span>
            )}
            <span>•</span>
            <span>Duration: {record.payload.duration_seconds}s</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Discrepancy Callout */}
      {discrepancy && (
        <div className="p-3.5 mx-5 mt-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs">
          <div className="flex items-center gap-2 font-bold text-amber-300 mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Telemetry Discrepancy: {discrepancy.field}</span>
          </div>
          <div className="text-dark-300 space-y-1 text-xs">
            <div>• <strong className="text-white">Logged:</strong> <em>{discrepancy.upstream_claim}</em></div>
            <div>• <strong className="text-white">Spoken Reality:</strong> <em>{discrepancy.spoken_reality}</em></div>
            <div className="text-amber-200/90 pt-1 font-medium">{discrepancy.impact_explanation}</div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-white/[0.06] bg-dark-850/40 px-5 mt-4">
        <button
          onClick={() => setActiveTab('analysis')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
            activeTab === 'analysis'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-dark-400 hover:text-dark-200'
          }`}
        >
          Analysis &amp; Intelligence
        </button>
        <button
          onClick={() => setActiveTab('transcript')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'transcript'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-dark-400 hover:text-dark-200'
          }`}
        >
          <span>Evidence &amp; Transcript</span>
          {record.has_usable_text && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('routing')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'routing'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-dark-400 hover:text-dark-200'
          }`}
        >
          <span>Routing &amp; Governance</span>
          {record.is_manually_corrected && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-sky-500/15 text-sky-300 font-semibold">Manual</span>
          )}
        </button>
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        
        {/* --- TAB 1: INTELLIGENCE BRIEF --- */}
        {activeTab === 'analysis' && (
          <div className="space-y-4 text-xs">
            
            {/* Executive Takeaway */}
            <div className="glass-card rounded-xl p-4 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Executive Takeaway
              </span>
              <p className="text-sm font-medium text-white leading-relaxed">
                {record.analysis.what_happened}
              </p>
            </div>

            {/* Strategic Impact */}
            <div className="glass-card rounded-xl p-4 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
                Managerial Significance
              </span>
              <p className="text-xs text-dark-200 leading-relaxed">
                {record.analysis.why_it_matters}
              </p>
            </div>

            {/* Supporting Evidence Citations */}
            <div className="glass-card rounded-xl p-4 space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                Verified Evidence Passages
              </span>
              {record.analysis.evidence_citations.length === 0 ? (
                <p className="text-dark-400 italic">No usable speech recorded. Claims withheld.</p>
              ) : (
                <div className="space-y-2">
                  {record.analysis.evidence_citations.map((cite) => (
                    <div 
                      key={cite.id}
                      onClick={() => handleJumpToCitation(cite.turn_number)}
                      className="p-3 rounded-lg bg-dark-900 border border-white/[0.08] hover:border-emerald-500/40 cursor-pointer transition group"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 mb-1">
                        <span>{cite.reference} {cite.speaker ? `(${cite.speaker})` : ''}</span>
                        <span className="text-dark-400 group-hover:text-emerald-400 flex items-center gap-1 text-[11px] font-normal">
                          Inspect passage &rarr;
                        </span>
                      </div>
                      {cite.quote && (
                        <blockquote className="border-l-2 border-emerald-500/40 pl-2.5 text-white font-mono text-xs mb-1.5">
                          "{cite.quote}"
                        </blockquote>
                      )}
                      <p className="text-dark-300 text-xs">{cite.note}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Items */}
            <div className="glass-card rounded-xl p-4 space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <ListTodo className="w-3.5 h-3.5" />
                Action Items &amp; Stated Owners
              </span>
              {record.analysis.next_steps.length === 0 ? (
                <p className="text-dark-400 italic">No immediate next steps derived.</p>
              ) : (
                <div className="space-y-2">
                  {record.analysis.next_steps.map((step, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-dark-900 border border-white/[0.06] flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold text-white text-xs">{step.action}</div>
                        <div className="text-[11px] text-dark-400 mt-0.5">
                          Target: {step.timing || 'Immediate'}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-purple-500/10 border border-purple-500/25 text-purple-300 whitespace-nowrap">
                        {step.owner || 'Unassigned'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Scope Boundaries */}
            <div className="p-3.5 rounded-xl border border-white/[0.05] bg-dark-900/40 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-dark-400">
                Scope Boundaries (What Evidence Does Not Establish)
              </span>
              <ul className="list-disc list-inside space-y-1 text-dark-400 text-xs mt-1">
                {record.analysis.what_evidence_does_not_establish.map((item, idx) => (
                  <li key={idx} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            </div>

          </div>
        )}

        {/* --- TAB 2: TRANSCRIPT --- */}
        {activeTab === 'transcript' && (
          <div className="space-y-3 text-xs">
            {record.has_usable_text ? (
              isCall ? (
                <div className="p-5 rounded-2xl glass-card space-y-3 font-mono leading-relaxed text-dark-200">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 text-dark-400 text-xs">
                    <span>Phone Audio Dialogue</span>
                    <span>{callPayload?.duration_seconds}s total</span>
                  </div>
                  <div className="whitespace-pre-wrap text-white text-xs font-sans leading-relaxed">
                    {callPayload?.transcript}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-dark-400 text-xs px-1 mb-2">
                    {turns.length} verified dialogue turns:
                  </div>
                  {turns.map((turn, i) => {
                    const turnNum = i + 1;
                    const isHighlighted = highlightedTurn === turnNum;
                    return (
                      <div
                        id={`turn-${turnNum}`}
                        key={i}
                        className={`p-3.5 rounded-xl border transition-all duration-200 ${
                          isHighlighted 
                            ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-xl ring-1 ring-emerald-500' 
                            : 'glass-card text-dark-200'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs mb-1.5 font-semibold">
                          <span className={isHighlighted ? 'text-emerald-300' : 'text-indigo-400'}>
                            Turn {turnNum} • {turn.speaker}
                          </span>
                          <span className="text-dark-400 font-mono text-[11px]">{turn.timecode}</span>
                        </div>
                        <p className="leading-relaxed text-white text-xs">
                          {turn.text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              <div className="p-8 text-center text-dark-400 rounded-2xl glass-card">
                <Info className="w-8 h-8 mx-auto text-dark-500 mb-2" />
                <h4 className="text-white font-medium mb-1">No Speech Recorded</h4>
                <p className="text-xs max-w-sm mx-auto">
                  {record.transcript_payload?.unavailable_reason || 
                   'Telephony signaling only. No usable conversation captured.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* --- TAB 3: ROUTING & GOVERNANCE --- */}
        {activeTab === 'routing' && (
          <div className="space-y-4 text-xs">
            
            <div className="glass-card rounded-xl p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-dark-400 font-medium">Recommended:</span>
                <div className="flex gap-1">
                  {record.suggested_routes.map(r => (
                    <span key={r} className="px-2 py-0.5 rounded text-[11px] font-mono bg-dark-800 text-dark-200 border border-white/[0.08]">
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/[0.06] pt-2">
                <span className="text-dark-400 font-medium">Active Classification:</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  record.is_manually_corrected 
                    ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30' 
                    : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {record.is_manually_corrected ? 'Manual Override Active' : 'System Recommendation'}
                </span>
              </div>
            </div>

            {/* Destination Selection */}
            <div className="glass-card rounded-xl p-4 space-y-3">
              <h4 className="font-semibold text-white text-xs">
                Select Destination Route(s)
              </h4>

              <div className="space-y-2">
                {AVAILABLE_ROUTES.map((route) => {
                  const isChecked = selectedRoutes.includes(route.id);
                  return (
                    <div
                      key={route.id}
                      onClick={() => handleRouteToggle(route.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                        isChecked 
                          ? `${route.theme.bg} ${route.theme.border} text-white` 
                          : 'bg-dark-900 border-white/[0.06] text-dark-300 hover:border-white/[0.12]'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-md border mt-0.5 flex items-center justify-center shrink-0 ${
                        isChecked ? `${route.theme.boxBg} ${route.theme.boxBorder} text-dark-950` : 'border-dark-600'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div>
                        <div className={`font-semibold text-xs ${isChecked ? route.theme.text : 'text-white'}`}>
                          {route.label}
                        </div>
                        <div className="text-[11px] text-dark-400 mt-0.5">
                          {route.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Override Justification */}
            <div className="glass-card rounded-xl p-4 space-y-2">
              <label className="block font-semibold text-white text-xs">
                Override Justification Note:
              </label>
              <textarea
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                placeholder="Explain reason for manual destination redirect..."
                rows={2}
                className="w-full p-2.5 rounded-xl bg-dark-900 border border-white/[0.08] text-white text-xs placeholder-dark-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            {/* Save Buttons */}
            <div className="flex items-center justify-between gap-3 pt-1">
              {record.is_manually_corrected ? (
                <button
                  type="button"
                  onClick={handleResetToSuggested}
                  disabled={isSavingRoute}
                  className="px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-750 text-dark-300 text-xs flex items-center gap-1.5 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Restore System Route
                </button>
              ) : <div></div>}

              <button
                type="button"
                onClick={handleSaveOverride}
                disabled={isSavingRoute}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition shadow"
              >
                <CheckCircle2 className="w-4 h-4" />
                {isSavingRoute ? 'Saving...' : 'Save Override'}
              </button>
            </div>

            {saveSuccessMsg && (
              <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-center text-xs font-medium">
                {saveSuccessMsg}
              </div>
            )}

          </div>
        )}

      </div>

      {/* Footer Status Bar */}
      <div className="p-4 border-t border-white/[0.08] bg-dark-850/80 backdrop-blur flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <span className="text-dark-400 font-medium">Review Status:</span>
          <ReviewStateDropdown
            value={record.review_state}
            onChange={(st) => onUpdateReviewState(st)}
            isLastFewRows={true}
          />
        </div>

        <div className="text-[11px] text-dark-400 font-mono">
          Last Synced: 21 Aug 2026
        </div>
      </div>

    </div>
  );
};
