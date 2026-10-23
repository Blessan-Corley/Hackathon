import React, { useState } from 'react';
import { 
  PhoneCall, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  Layers,
  Sparkles
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

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      
      {/* 1. Total Selected Records */}
      <div 
        onClick={() => onFilterBySource?.('all')}
        className="glass-card glass-card-hover rounded-2xl p-4 cursor-pointer relative"
      >
        <div className="flex items-center justify-between text-dark-400 mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-dark-400">Total Records</span>
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); setActiveTooltip(activeTooltip === 'total' ? null : 'total'); }}
            className="text-dark-500 hover:text-dark-300"
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
          <div className="absolute top-full left-0 mt-2 z-40 w-60 p-3 rounded-xl bg-dark-900 border border-white/[0.12] text-xs text-dark-200 shadow-2xl">
            <strong className="text-white block mb-0.5">Total Ingested Records</strong>
            Distinct (source_type, source_id) units across August 21, 2026.
          </div>
        )}
      </div>

      {/* 2. Usable Transcript Coverage */}
      <div 
        onClick={() => onFilterByTranscript?.('true')}
        className="glass-card glass-card-hover rounded-2xl p-4 cursor-pointer relative"
      >
        <div className="flex items-center justify-between text-dark-400 mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-dark-400">Transcript Coverage</span>
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); setActiveTooltip(activeTooltip === 'coverage' ? null : 'coverage'); }}
            className="text-dark-500 hover:text-dark-300"
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
          <div className="absolute top-full left-0 mt-2 z-40 w-64 p-3 rounded-xl bg-dark-900 border border-white/[0.12] text-xs text-dark-200 shadow-2xl">
            <strong className="text-white block mb-0.5">Coverage Definition</strong>
            Conversations with verified speech (calls with text or meetings with turns) over total records.
          </div>
        )}
      </div>

      {/* 3. Channel Breakdown */}
      <div className="glass-card rounded-2xl p-4 relative">
        <div className="flex items-center justify-between text-dark-400 mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-dark-400">By Channel</span>
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); setActiveTooltip(activeTooltip === 'breakdown' ? null : 'breakdown'); }}
            className="text-dark-500 hover:text-dark-300"
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
          <div className="absolute top-full left-0 mt-2 z-40 w-64 p-3 rounded-xl bg-dark-900 border border-white/[0.12] text-xs text-dark-200 shadow-2xl">
            <strong className="text-white block mb-0.5">Channel Breakdown</strong>
            Separates phone calls from calendar meetings so coverage is clear by channel.
          </div>
        )}
      </div>

      {/* 4. Connection Rate */}
      <div className="glass-card rounded-2xl p-4 relative">
        <div className="flex items-center justify-between text-dark-400 mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-dark-400">Connection Rate</span>
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); setActiveTooltip(activeTooltip === 'connect' ? null : 'connect'); }}
            className="text-dark-500 hover:text-dark-300"
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
          <div className="absolute top-full right-0 mt-2 z-40 w-68 p-3 rounded-xl bg-dark-900 border border-white/[0.12] text-xs text-dark-200 shadow-2xl">
            <strong className="text-white block mb-0.5">Telephony Telemetry</strong>
            Calls reporting <code>is_connected: true</code> in source telephony logs.
          </div>
        )}
      </div>

      {/* 5. Review Backlog */}
      <div 
        onClick={() => onFilterByReview?.('unreviewed')}
        className="glass-card glass-card-hover rounded-2xl p-4 cursor-pointer"
      >
        <div className="flex items-center justify-between text-dark-400 mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-dark-400">Review Status</span>
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
            <span className="text-rose-400">({metrics.review_counts.pending_re_review} updated)</span>
          )}
        </div>
      </div>

      {/* 6. Discrepancy Alerts */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex items-center justify-between text-dark-400 mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-dark-400">Quality Signals</span>
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
      </div>

    </div>
  );
};
