import React, { useState, useRef, useEffect } from 'react';
import { 
  PhoneCall, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  ShieldAlert,
  SlidersHorizontal,
  Clock,
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
    <div ref={containerRef} className="space-y-3 mb-6 relative z-30">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
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

      {/* 7. Hourly Activity Timeline Strip (09:00 - 23:00 Asia/Kolkata) */}
      {metrics.hourly_activity && metrics.hourly_activity.length > 0 && (
        <div className="glass-card rounded-2xl p-4 border border-white/[0.08] relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-semibold text-white tracking-tight">
                Activity Distribution by Hour — 21 August 2026 (Asia/Kolkata)
              </span>
              <span className="text-[11px] text-dark-400 font-mono">
                ({metrics.total_selected_records} records in current filter slice)
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-sky-400 inline-block"></span>
                <span className="text-dark-300">Calls ({metrics.total_calls})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-purple-400 inline-block"></span>
                <span className="text-dark-300">Meetings ({metrics.total_meetings})</span>
              </div>
            </div>
          </div>

          {/* Hourly bar slots */}
          <div className="grid grid-cols-5 sm:grid-cols-15 gap-1.5 pt-1">
            {metrics.hourly_activity
              .filter(p => p.hour >= 9 && p.hour <= 23)
              .map((point) => {
                const maxVol = Math.max(...metrics.hourly_activity!.map(x => x.total), 1);
                const heightPct = point.total > 0 ? Math.max(Math.round((point.total / maxVol) * 100), 22) : 0;

                return (
                  <div
                    key={point.hour}
                    className="flex flex-col items-center group relative cursor-pointer"
                    title={`${point.label} IST: ${point.total} total (${point.calls} calls, ${point.meetings} meetings)`}
                  >
                    <div className="h-12 w-full flex items-end justify-center rounded-lg bg-dark-900/60 p-1 border border-white/[0.04] group-hover:border-white/[0.16] transition">
                      {point.total > 0 ? (
                        <div 
                          className="w-full rounded-sm flex flex-col justify-end overflow-hidden transition-all duration-300"
                          style={{ height: `${heightPct}%` }}
                        >
                          {point.meetings > 0 && (
                            <div 
                              className="w-full bg-purple-500/80 hover:bg-purple-400 transition"
                              style={{ height: `${(point.meetings / point.total) * 100}%` }}
                            />
                          )}
                          {point.calls > 0 && (
                            <div 
                              className="w-full bg-sky-500/80 hover:bg-sky-400 transition"
                              style={{ height: `${(point.calls / point.total) * 100}%` }}
                            />
                          )}
                        </div>
                      ) : (
                        <div className="w-full h-1 rounded-full bg-dark-800" />
                      )}
                    </div>

                    <span className="text-[10px] font-mono mt-1 text-dark-400 group-hover:text-white transition">
                      {point.label.slice(0, 2)}h
                    </span>
                    <span className="text-[9px] font-mono text-dark-300 font-bold">
                      {point.total > 0 ? point.total : '-'}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}

    </div>
  );
};
