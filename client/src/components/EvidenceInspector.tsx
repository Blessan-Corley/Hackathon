import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  FileText, 
  ShieldCheck, 
  ExternalLink,
  Clock, 
  Tag, 
  Quote, 
  Calendar, 
  PhoneCall,
  User,
  Check,
  Building,
  Info
} from 'lucide-react';
import { ProcessedRecord, RouteCategory, ReviewState, CallPayload, MeetingPayload, MeetingTurn } from '../types/index.js';

interface EvidenceInspectorProps {
  record: ProcessedRecord;
  onClose: () => void;
  onUpdateRoute: (routes: RouteCategory[], reason?: string) => Promise<void>;
  onResetRoute: () => Promise<void>;
  onUpdateReviewState: (state: ReviewState) => Promise<void>;
}

const AVAILABLE_ROUTES: Array<{ id: RouteCategory; label: string; desc: string }> = [
  { id: 'deal_next_steps', label: 'Deal Next Steps', desc: 'Active sales opportunity qualification & pipeline movement' },
  { id: 'sales_coaching', label: 'Sales Coaching', desc: 'Rep development, pitch feedback, and objection handling' },
  { id: 'customer_success', label: 'Customer Success', desc: 'Account retention, feature adoption, and program migration' },
  { id: 'customer_support', label: 'Customer Support', desc: 'Technical troubleshooting, bug escalation, and onboarding defects' },
  { id: 'partnerships', label: 'Partnerships', desc: 'Channel referral partnerships and reseller development' },
  { id: 'internal_ops', label: 'Internal Operations', desc: 'Internal staff training, vendor contracts, and non-sales admin' },
  { id: 'intake_exception', label: 'Intake Exception', desc: 'Unattended calls, silent recordings, or cancelled meetings' }
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

  // Manual route state
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
      setSaveSuccessMsg('Manual route saved and preserved in state.');
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
      setSaveSuccessMsg('Restored automated suggested route.');
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    } finally {
      setIsSavingRoute(false);
    }
  };

  const handleJumpToCitation = (turnNumber?: number) => {
    if (turnNumber) {
      setHighlightedTurn(turnNumber);
      setActiveTab('transcript');
      // Scroll to turn element
      setTimeout(() => {
        const el = document.getElementById(`turn-${turnNumber}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } else {
      setActiveTab('transcript');
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-obsidian-900 border-l border-obsidian-750 shadow-2xl z-40 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
      
      {/* Header Bar */}
      <div className="p-4 border-b border-obsidian-800 bg-obsidian-850/80 backdrop-blur flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`px-2 py-0.5 rounded font-mono text-xs font-bold border ${
              record.record_ref.startsWith('M') 
                ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300' 
                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
            }`}>
              {record.record_ref}
            </span>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-obsidian-800 border border-obsidian-700 text-obsidian-300">
              Identity: <strong className="text-white">({record.source_type}, {record.source_id.substring(0, 8)}...)</strong>
            </span>
            <span className="px-1.5 py-0.5 rounded text-xs font-mono bg-purple-500/10 border border-purple-500/20 text-purple-300">
              Rev {record.current_revision} ({record.last_batch_id})
            </span>
          </div>

          <h3 className="text-base font-bold text-white line-clamp-1">
            {record.analysis?.headline || meetingPayload?.title || 'Interaction Detail'}
          </h3>

          <div className="flex items-center gap-2 text-xs text-obsidian-400 font-mono mt-1">
            {isCall ? (
              <span>Rep: <strong className="text-obsidian-200">{callPayload?.rep_name || callPayload?.rep_email}</strong></span>
            ) : (
              <span>Organizer: <strong className="text-obsidian-200">{meetingPayload?.organizer_email}</strong></span>
            )}
            <span>•</span>
            <span>Duration: {record.payload.duration_seconds}s</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-md text-obsidian-400 hover:text-white hover:bg-obsidian-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Discrepancy Alert Banner */}
      {discrepancy && (
        <div className="p-3 mx-4 mt-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs">
          <div className="flex items-center gap-2 font-bold text-amber-300 mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Upstream Discrepancy Alert: {discrepancy.field}</span>
          </div>
          <div className="text-obsidian-300 space-y-1 text-[11px]">
            <div>• <strong className="text-obsidian-100">Metadata Claimed:</strong> <em>{discrepancy.upstream_claim}</em></div>
            <div>• <strong className="text-obsidian-100">Spoken Reality:</strong> <em>{discrepancy.spoken_reality}</em></div>
            <div className="text-amber-200/90 pt-0.5">⚠️ {discrepancy.impact_explanation}</div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-obsidian-800 bg-obsidian-850/50 px-4 mt-3">
        <button
          onClick={() => setActiveTab('analysis')}
          className={`px-4 py-2 text-xs font-medium border-b-2 transition ${
            activeTab === 'analysis'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-obsidian-400 hover:text-obsidian-200'
          }`}
        >
          Analysis &amp; Intelligence
        </button>
        <button
          onClick={() => setActiveTab('transcript')}
          className={`px-4 py-2 text-xs font-medium border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'transcript'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-obsidian-400 hover:text-obsidian-200'
          }`}
        >
          <span>Evidence &amp; Transcript</span>
          {record.has_usable_text && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('routing')}
          className={`px-4 py-2 text-xs font-medium border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'routing'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-obsidian-400 hover:text-obsidian-200'
          }`}
        >
          <span>Routing &amp; Governance</span>
          {record.is_manually_corrected && (
            <span className="px-1 py-0.2 rounded text-[10px] bg-cyan-500/20 text-cyan-300 font-mono">Manual</span>
          )}
        </button>
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* --- TAB 1: ANALYSIS & INTELLIGENCE --- */}
        {activeTab === 'analysis' && (
          <div className="space-y-4 text-xs">
            
            {/* What Happened */}
            <div className="p-3.5 rounded-lg bg-obsidian-850 border border-obsidian-800 space-y-1.5">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] font-mono text-emerald-400">
                1. What Happened
              </h4>
              <p className="text-obsidian-200 leading-relaxed">
                {record.analysis.what_happened}
              </p>
            </div>

            {/* Why It Matters */}
            <div className="p-3.5 rounded-lg bg-obsidian-850 border border-obsidian-800 space-y-1.5">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] font-mono text-cyan-400">
                2. Why It Matters to Management
              </h4>
              <p className="text-obsidian-200 leading-relaxed">
                {record.analysis.why_it_matters}
              </p>
            </div>

            {/* Supporting Evidence Citations */}
            <div className="p-3.5 rounded-lg bg-obsidian-850 border border-obsidian-800 space-y-2">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] font-mono text-indigo-400">
                3. Supporting Evidence Passages
              </h4>
              {record.analysis.evidence_citations.length === 0 ? (
                <p className="text-obsidian-400 italic">No usable text supplied; substantive claims withheld.</p>
              ) : (
                <div className="space-y-2">
                  {record.analysis.evidence_citations.map((cite) => (
                    <div 
                      key={cite.id}
                      onClick={() => handleJumpToCitation(cite.turn_number)}
                      className="p-2.5 rounded bg-obsidian-900 border border-obsidian-750 hover:border-emerald-500/50 cursor-pointer transition group"
                    >
                      <div className="flex items-center justify-between font-mono text-[11px] text-emerald-400 mb-1">
                        <span>{cite.reference} {cite.speaker ? `(${cite.speaker})` : ''}</span>
                        <span className="text-obsidian-500 group-hover:text-emerald-400 flex items-center gap-1 text-[10px]">
                          View in Transcript &rarr;
                        </span>
                      </div>
                      {cite.quote && (
                        <blockquote className="border-l-2 border-emerald-500/40 pl-2 text-obsidian-100 font-mono text-[11px] mb-1">
                          "{cite.quote}"
                        </blockquote>
                      )}
                      <p className="text-obsidian-400 text-[11px]">{cite.note}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Honest Uncertainty: What Evidence Does NOT Establish */}
            <div className="p-3.5 rounded-lg bg-obsidian-850 border border-obsidian-800 space-y-1.5">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] font-mono text-amber-400">
                4. Honest Uncertainty (What Evidence Does NOT Establish)
              </h4>
              <ul className="list-disc list-inside space-y-1 text-obsidian-300">
                {record.analysis.what_evidence_does_not_establish.map((item, idx) => (
                  <li key={idx} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            </div>

            {/* Next Steps & Ownership */}
            <div className="p-3.5 rounded-lg bg-obsidian-850 border border-obsidian-800 space-y-2">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] font-mono text-purple-400">
                5. Actionable Next Steps &amp; Ownership
              </h4>
              {record.analysis.next_steps.length === 0 ? (
                <p className="text-obsidian-400 italic">No next steps required.</p>
              ) : (
                <div className="space-y-1.5">
                  {record.analysis.next_steps.map((step, idx) => (
                    <div key={idx} className="p-2 rounded bg-obsidian-900 border border-obsidian-750 flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold text-white">{step.action}</div>
                        <div className="text-[11px] text-obsidian-400 font-mono mt-0.5">
                          Timing: {step.timing || 'Immediate'}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 border border-purple-500/30 text-purple-300 whitespace-nowrap">
                        Owner: {step.owner || 'Unassigned'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* --- TAB 2: EVIDENCE & TRANSCRIPT --- */}
        {activeTab === 'transcript' && (
          <div className="space-y-3 text-xs">
            {record.has_usable_text ? (
              isCall ? (
                <div className="p-4 rounded-lg bg-obsidian-850 border border-obsidian-800 space-y-3 font-mono leading-relaxed text-obsidian-200">
                  <div className="flex items-center justify-between border-b border-obsidian-750 pb-2 text-obsidian-400 text-[11px]">
                    <span>Source: Phone Call Audio Transcript</span>
                    <span>Duration: {callPayload?.duration_seconds}s</span>
                  </div>
                  <div className="whitespace-pre-wrap text-obsidian-100">
                    {callPayload?.transcript}
                  </div>
                </div>
              ) : (
                <div className="space-y-2 font-mono">
                  <div className="text-obsidian-400 text-[11px] px-1 mb-2">
                    Showing {turns.length} verified meeting turns with speaker timestamps:
                  </div>
                  {turns.map((turn, i) => {
                    const turnNum = i + 1;
                    const isHighlighted = highlightedTurn === turnNum;
                    return (
                      <div
                        id={`turn-${turnNum}`}
                        key={i}
                        className={`p-3 rounded-lg border transition ${
                          isHighlighted 
                            ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-lg' 
                            : 'bg-obsidian-850 border-obsidian-800 text-obsidian-200'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] mb-1 font-semibold text-obsidian-400">
                          <span className={isHighlighted ? 'text-emerald-300 font-bold' : 'text-indigo-400'}>
                            Turn {turnNum} • {turn.speaker}
                          </span>
                          <span className="text-obsidian-500">{turn.timecode}</span>
                        </div>
                        <p className="leading-relaxed text-obsidian-100 font-sans">
                          {turn.text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              <div className="p-8 text-center text-obsidian-400 rounded-lg bg-obsidian-850 border border-obsidian-800">
                <Info className="w-8 h-8 mx-auto text-obsidian-600 mb-2" />
                <h4 className="text-white font-medium mb-1">No Usable Transcript Supplied</h4>
                <p className="text-xs max-w-md mx-auto">
                  {record.transcript_payload?.unavailable_reason || 
                   'Background call telemetry only. Per data contract rules, substantive conversational analysis is withheld.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* --- TAB 3: ROUTING & MANUAL GOVERNANCE --- */}
        {activeTab === 'routing' && (
          <div className="space-y-4 text-xs">
            
            {/* Suggested vs Manual Status */}
            <div className="p-3.5 rounded-lg bg-obsidian-850 border border-obsidian-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-obsidian-400 font-medium">Automated Recommendation:</span>
                <div className="flex gap-1">
                  {record.suggested_routes.map(r => (
                    <span key={r} className="px-2 py-0.5 rounded text-[10px] font-mono bg-obsidian-750 text-obsidian-200 border border-obsidian-700">
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-obsidian-750 pt-2">
                <span className="text-obsidian-400 font-medium">Current Status:</span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                  record.is_manually_corrected 
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                    : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                }`}>
                  {record.is_manually_corrected ? 'Manual Override In Effect' : 'Automated Suggestion'}
                </span>
              </div>
            </div>

            {/* Route Selector (Multi-select) */}
            <div className="p-3.5 rounded-lg bg-obsidian-850 border border-obsidian-800 space-y-3">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] font-mono">
                Select Destination Route(s)
              </h4>
              <p className="text-[11px] text-obsidian-400">
                A conversation can have one or several destinations depending on requirements (e.g. Sales Coaching + Deal Next Steps).
              </p>

              <div className="space-y-2">
                {AVAILABLE_ROUTES.map((route) => {
                  const isChecked = selectedRoutes.includes(route.id);
                  return (
                    <div
                      key={route.id}
                      onClick={() => handleRouteToggle(route.id)}
                      className={`p-2.5 rounded-lg border cursor-pointer transition flex items-start gap-3 ${
                        isChecked 
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-white' 
                          : 'bg-obsidian-900 border-obsidian-800 text-obsidian-300 hover:border-obsidian-700'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center shrink-0 ${
                        isChecked ? 'bg-emerald-500 border-emerald-400 text-obsidian-950' : 'border-obsidian-600'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div>
                        <div className="font-semibold text-xs flex items-center gap-2">
                          <span>{route.label}</span>
                          <span className="font-mono text-[10px] text-obsidian-400">({route.id})</span>
                        </div>
                        <div className="text-[11px] text-obsidian-400 mt-0.5">
                          {route.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Override Reason Note */}
            <div className="p-3.5 rounded-lg bg-obsidian-850 border border-obsidian-800 space-y-2">
              <label className="block font-bold text-white uppercase tracking-wider text-[11px] font-mono">
                Manual Override Reason / Justification:
              </label>
              <textarea
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                placeholder="Explain why this conversation was manually redirected..."
                rows={2}
                className="w-full p-2.5 rounded bg-obsidian-900 border border-obsidian-750 text-white text-xs placeholder-obsidian-500 focus:outline-none focus:border-emerald-500 font-sans"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-3 pt-2">
              {record.is_manually_corrected ? (
                <button
                  type="button"
                  onClick={handleResetToSuggested}
                  disabled={isSavingRoute}
                  className="px-3 py-1.5 rounded bg-obsidian-800 hover:bg-obsidian-750 text-obsidian-300 border border-obsidian-700 font-mono text-xs flex items-center gap-1.5 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset to Automated
                </button>
              ) : <div></div>}

              <button
                type="button"
                onClick={handleSaveOverride}
                disabled={isSavingRoute}
                className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1.5 transition shadow"
              >
                <CheckCircle2 className="w-4 h-4" />
                {isSavingRoute ? 'Saving...' : 'Save Manual Override'}
              </button>
            </div>

            {saveSuccessMsg && (
              <div className="p-2 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-center font-mono text-xs">
                {saveSuccessMsg}
              </div>
            )}

          </div>
        )}

      </div>

      {/* Footer Bar: Review State Quick Toggles */}
      <div className="p-3 border-t border-obsidian-800 bg-obsidian-850/80 backdrop-blur flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-obsidian-400 font-mono">Intake State:</span>
          <span className={`px-2 py-0.5 rounded font-mono text-[11px] ${
            record.review_state === 'reviewed' 
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
          }`}>
            {record.review_state}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {record.review_state !== 'reviewed' ? (
            <button
              onClick={() => onUpdateReviewState('reviewed')}
              className="px-3 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-medium text-xs transition flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              Mark as Reviewed
            </button>
          ) : (
            <button
              onClick={() => onUpdateReviewState('unreviewed')}
              className="px-2.5 py-1 rounded bg-obsidian-800 hover:bg-obsidian-750 text-obsidian-300 border border-obsidian-700 text-xs transition"
            >
              Reopen
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
