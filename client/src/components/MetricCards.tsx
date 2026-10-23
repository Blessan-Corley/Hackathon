import React, { useState, useRef, useEffect } from 'react';
import { 
  PhoneCall, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  ShieldAlert,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { DashboardMetrics } from '../types/index.js';

interface MetricCardsProps {
  metrics: DashboardMetrics;
  onFilterByTranscript?: (val: string) => void;
  onFilterByReview?: (val: string) => void;
  onFilterBySource?: (val: string) => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  metrics,
  onFilterByTranscript,
  onFilterByReview,
  onFilterBySource
}) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close tooltip on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveTooltip(null);
      }
    };
    if (activeTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeTooltip]);

  // Close tooltip on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveTooltip(null);
    };
    if (activeTooltip) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeTooltip]);

  const toggleTooltip = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveTooltip(activeTooltip === id ? null : id);
  };

  return (
    <div ref={containerRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6 relative z-30">
      
      {/* 1. Total Selected Records */}
      <div 
        onClick={() => onFilterBySource?.('all')}
        className={`glass-card glass-card-hover rounded-2xl p-4 cursor-pointer relative transition-all ${
          activeTooltip === 'total' ? 'z-50 ring-1 ring-white/20' : 'z-10'
        }`}
      >
        <div className="flex items-center justify-between text-dark-400 mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-dark-400">Total Records</span>
          <button 
            type="button"
            onClick={(e) => toggleTooltip('total', e)}
            className="p-1 -mr-1 rounded-md text-dark-400 hover:text-white hover:bg-dark-800 transition"
            aria-label="Info about Total Records"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="text-3xl font-bold text-white tracking-tight">
          {metrics.total_selected_records}
        </div>
        <div className="text-[11px] text-dark-400 mt-2 flex items-center gap-1.5 font-medium">
          <span className="text-dark-300">{metrics.total_calls} calls</span>
          <span>•</span>
          <span className="text-dark-300">{metrics.total_meetings} meetings</span>
        </div>

        {activeTooltip === 'total' && (
          <div className="absolute top-full left-0 mt-2.5 z-50 w-72 max-w-[calc(100vw-2rem)] p-3.5 rounded-xl bg-dark-900/98 border border-white/[0.14] text-xs text-dark-200 shadow-2xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95">
            <div className="flex items-center justify-between font-semibold text-white mb-1">
              <span>Total Ingested Records</span>
              <button onClick={(e) => { e.stopPropagation(); setActiveTooltip(null); }} className="text-dark-400 hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </div>
            <p className="text-dark-300 leading-relaxed text-[11px]">
              Strict composite identity <code className="text-dark-200 font-mono">(source_type, source_id)</code>. Deduplicated across all deliveries.
            </p>
          </div>
        )}
      </div>

      {/* 2. Usable Transcript Coverage */}
      <div 
        onClick={() => onFilterByTranscript?.('true')}
        className={`glass-card glass-card-hover rounded-2xl p-4 cursor-pointer relative transition-all ${
          activeTooltip === 'coverage' ? 'z-50 ring-1 ring-white/20' : 'z-10'
        }`}
      >
        <div className="flex items-center justify-between text-dark-400 mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-dark-400">Transcript Coverage</span>
          <button 
            type="button"
            onClick={(e) => toggleTooltip('coverage', e)}
            className="p-1 -mr-1 rounded-md text-dark-400 hover:text-white hover:bg-dark-800 transition"
            aria-label="Info about Transcript Coverage"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="text-3xl font-bold text-emerald-400 tracking-tight">
          {metrics.usable_transcript_coverage_rate}%
        </div>
        
        {/* Progress bar visualizer */}
        <div className="w-full h-1 bg-dark-800 rounded-full mt-2.5 overflow-hidden">
          <div 
            className="h-full bg-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${metrics.usable_transcript_coverage_rate}%` }}
          ></div>
        </div>

        <div className="text-[11px] text-dark-400 mt-1.5 font-medium">
          <span className="text-white font-semibold">{metrics.usable_transcript_count}</span>
          <span> of {metrics.usable_transcript_denominator} conversations</span>
        </div>

        {activeTooltip === 'coverage' && (
          <div className="absolute top-full right-0 lg:left-0 mt-2.5 z-50 w-72 max-w-[calc(100vw-2rem)] p-3.5 rounded-xl bg-dark-900/98 border border-white/[0.14] text-xs text-dark-200 shadow-2xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95">
            <div className="flex items-center justify-between font-semibold text-white mb-1">
              <span>Coverage Formula</span>
              <button onClick={(e) => { e.stopPropagation(); setActiveTooltip(null); }} className="text-dark-400 hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </div>
            <p className="text-dark-300 leading-relaxed text-[11px]">
              Numerator: 18 records with spoken speech (10 calls + 8 meetings). Denominator: 44 total records (including 26 voicemails and unattended meetings).
            </p>
          </div>
        )}
      </div>

      {/* 3. Channel Breakdown */}
      <div 
        className={`glass-card rounded-2xl p-4 relative transition-all ${
          activeTooltip === 'breakdown' ? 'z-50 ring-1 ring-white/20' : 'z-10'
        }`}
      >
        <div className="flex items-center justify-between text-dark-400 mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-dark-400">By Channel</span>
          <button 
            type="button"
            onClick={(e) => toggleTooltip('breakdown', e)}
            className="p-1 -mr-1 rounded-md text-dark-400 hover:text-white hover:bg-dark-800 transition"
            aria-label="Info about Channel Breakdown"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex items-baseline justify-between mt-1">
          <div>
            <div className="text-xl font-bold text-sky-400 tracking-tight">
              {metrics.call_transcript_count}<span className="text-xs text-dark-400 font-normal">/{metrics.call_transcript_denominator}</span>
            </div>
            <div className="text-[10px] text-dark-400 uppercase font-semibold mt-0.5">Calls ({metrics.call_transcript_coverage_rate}%)</div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-indigo-400 tracking-tight">
              {metrics.meeting_transcript_count}<span className="text-xs text-dark-400 font-normal">/{metrics.meeting_transcript_denominator}</span>
            </div>
            <div className="text-[10px] text-dark-400 uppercase font-semibold mt-0.5">Mtgs ({metrics.meeting_transcript_coverage_rate}%)</div>
          </div>
        </div>

        {activeTooltip === 'breakdown' && (
          <div className="absolute top-full left-0 md:right-0 lg:left-1/2 lg:-translate-x-1/2 mt-2.5 z-50 w-72 max-w-[calc(100vw-2rem)] p-3.5 rounded-xl bg-dark-900/98 border border-white/[0.14] text-xs text-dark-200 shadow-2xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95">
            <div className="flex items-center justify-between font-semibold text-white mb-1">
              <span>Channel Separation</span>
              <button onClick={(e) => { e.stopPropagation(); setActiveTooltip(null); }} className="text-dark-400 hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </div>
            <p className="text-dark-300 leading-relaxed text-[11px]">
              Maintains independent denominators for 30 phone dials vs 14 scheduled calendar meetings.
            </p>
          </div>
        )}
      </div>

      {/* 4. Connection Rate */}
      <div 
        className={`glass-card rounded-2xl p-4 relative transition-all ${
          activeTooltip === 'connect' ? 'z-50 ring-1 ring-white/20' : 'z-10'
        }`}
      >
        <div className="flex items-center justify-between text-dark-400 mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-dark-400">Connection Rate</span>
          <button 
            type="button"
            onClick={(e) => toggleTooltip('connect', e)}
            className="p-1 -mr-1 rounded-md text-dark-400 hover:text-white hover:bg-dark-800 transition"
            aria-label="Info about Connection Rate"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="text-3xl font-bold text-amber-400 tracking-tight">
          {metrics.source_reported_connection_rate}%
        </div>
        <div className="text-[11px] text-dark-400 mt-2 font-medium">
          <span className="text-white font-semibold">{metrics.source_reported_connected_calls}</span>
          <span> of {metrics.source_reported_evaluated_calls} connected</span>
        </div>

        {activeTooltip === 'connect' && (
          <div className="absolute top-full right-0 md:left-0 lg:right-0 mt-2.5 z-50 w-72 max-w-[calc(100vw-2rem)] p-3.5 rounded-xl bg-dark-900/98 border border-white/[0.14] text-xs text-dark-200 shadow-2xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95">
            <div className="flex items-center justify-between font-semibold text-white mb-1">
              <span>Telephony Connect Rate</span>
              <button onClick={(e) => { e.stopPropagation(); setActiveTooltip(null); }} className="text-dark-400 hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </div>
            <p className="text-dark-300 leading-relaxed text-[11px]">
              Measures upstream telephony tags. Note: calls B11 and B14 claim connected but are unresponsive, while C04 claims disconnected despite rep speaking 95s.
            </p>
          </div>
        )}
      </div>

      {/* 5. Review Backlog */}
      <div 
        onClick={() => onFilterByReview?.('unreviewed')}
        className={`glass-card glass-card-hover rounded-2xl p-4 cursor-pointer relative transition-all ${
          activeTooltip === 'review' ? 'z-50 ring-1 ring-white/20' : 'z-10'
        }`}
      >
        <div className="flex items-center justify-between text-dark-400 mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-dark-400">Review Status</span>
          <button 
            type="button"
            onClick={(e) => toggleTooltip('review', e)}
            className="p-1 -mr-1 rounded-md text-dark-400 hover:text-white hover:bg-dark-800 transition"
            aria-label="Info about Review Status"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-bold text-white tracking-tight">
            {metrics.review_counts.reviewed}
          </span>
          <span className="text-xs text-dark-400 font-medium">
            / {metrics.total_selected_records} done
          </span>
        </div>
        <div className="text-[11px] text-dark-400 mt-2 font-medium flex items-center gap-1.5">
          <span className="text-amber-400 font-semibold">{metrics.review_counts.unreviewed} pending</span>
          {metrics.review_counts.pending_re_review > 0 && (
            <span className="text-rose-400 font-semibold">({metrics.review_counts.pending_re_review} updated)</span>
          )}
        </div>

        {activeTooltip === 'review' && (
          <div className="absolute top-full left-0 md:left-1/2 md:-translate-x-1/2 lg:right-0 lg:translate-x-0 mt-2.5 z-50 w-72 max-w-[calc(100vw-2rem)] p-3.5 rounded-xl bg-dark-900/98 border border-white/[0.14] text-xs text-dark-200 shadow-2xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95">
            <div className="flex items-center justify-between font-semibold text-white mb-1">
              <span>Review Lifecycle</span>
              <button onClick={(e) => { e.stopPropagation(); setActiveTooltip(null); }} className="text-dark-400 hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </div>
            <p className="text-dark-300 leading-relaxed text-[11px]">
              Tracks manager triage queue. Incoming revision changes (such as M07 v2) automatically transition from reviewed to "Needs Re-review".
            </p>
          </div>
        )}
      </div>

      {/* 6. Discrepancy Alerts */}
      <div 
        className={`glass-card rounded-2xl p-4 relative transition-all ${
          activeTooltip === 'quality' ? 'z-50 ring-1 ring-white/20' : 'z-10'
        }`}
      >
        <div className="flex items-center justify-between text-dark-400 mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-dark-400">Quality Signals</span>
          <button 
            type="button"
            onClick={(e) => toggleTooltip('quality', e)}
            className="p-1 -mr-1 rounded-md text-dark-400 hover:text-white hover:bg-dark-800 transition"
            aria-label="Info about Quality Signals"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex items-baseline justify-between mt-1">
          <div>
            <div className="text-2xl font-bold text-amber-400 tracking-tight">
              {metrics.discrepancies_detected_count}
            </div>
            <div className="text-[10px] text-dark-400 uppercase font-semibold mt-0.5">Discrepancies</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-sky-400 tracking-tight">
              {metrics.manual_corrections_count}
            </div>
            <div className="text-[10px] text-dark-400 uppercase font-semibold mt-0.5">Overrides</div>
          </div>
        </div>

        {activeTooltip === 'quality' && (
          <div className="absolute top-full right-0 mt-2.5 z-50 w-72 max-w-[calc(100vw-2rem)] p-3.5 rounded-xl bg-dark-900/98 border border-white/[0.14] text-xs text-dark-200 shadow-2xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95">
            <div className="flex items-center justify-between font-semibold text-white mb-1">
              <span>Quality Audits</span>
              <button onClick={(e) => { e.stopPropagation(); setActiveTooltip(null); }} className="text-dark-400 hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </div>
            <p className="text-dark-300 leading-relaxed text-[11px]">
              Surfaces telemetry anomalies (outcome mismatches, caller attribution conflicts) alongside human manager overrides.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
