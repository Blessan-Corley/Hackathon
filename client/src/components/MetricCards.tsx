import React, { useState } from 'react';
import { 
  FileText, 
  PhoneCall, 
  Users, 
  Radio, 
  HelpCircle, 
  CheckCircle, 
  Clock, 
  AlertOctagon,
  ChevronRight
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
        className="p-3.5 rounded-lg bg-obsidian-900 border border-obsidian-800 hover:border-obsidian-700 transition cursor-pointer relative group"
      >
        <div className="flex items-center justify-between text-obsidian-400 mb-1">
          <span className="text-xs font-medium uppercase tracking-wider">Total Records</span>
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); setActiveTooltip(activeTooltip === 'total' ? null : 'total'); }}
            className="text-obsidian-500 hover:text-obsidian-300"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="text-2xl font-bold font-mono text-white">
          {metrics.total_selected_records}
        </div>
        <div className="text-[11px] text-obsidian-400 mt-1 flex items-center gap-1.5 font-mono">
          <span>{metrics.total_calls} Calls</span>
          <span>•</span>
          <span>{metrics.total_meetings} Meetings</span>
        </div>

        {activeTooltip === 'total' && (
          <div className="absolute top-full left-0 mt-2 z-40 w-64 p-3 rounded-lg bg-obsidian-850 border border-obsidian-700 text-xs text-obsidian-200 shadow-xl">
            <strong className="text-white block mb-1">Denominator: Total Extracted Records</strong>
            Total distinct (source_type, source_id) tuples in dataset. 30 phone calls + 14 calendar meetings on 2026-08-21 (Asia/Kolkata).
          </div>
        )}
      </div>

      {/* 2. Overall Usable Transcript Coverage */}
      <div 
        onClick={() => onFilterByTranscript?.('true')}
        className="p-3.5 rounded-lg bg-obsidian-900 border border-obsidian-800 hover:border-obsidian-700 transition cursor-pointer relative group"
      >
        <div className="flex items-center justify-between text-obsidian-400 mb-1">
          <span className="text-xs font-medium uppercase tracking-wider">Transcript Coverage</span>
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); setActiveTooltip(activeTooltip === 'coverage' ? null : 'coverage'); }}
            className="text-obsidian-500 hover:text-obsidian-300"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="text-2xl font-bold font-mono text-emerald-400">
          {metrics.usable_transcript_coverage_rate}%
        </div>
        <div className="text-[11px] text-obsidian-400 mt-1 font-mono">
          <span className="text-white font-semibold">{metrics.usable_transcript_count}</span>
          <span> / {metrics.usable_transcript_denominator} records</span>
        </div>

        {activeTooltip === 'coverage' && (
          <div className="absolute top-full left-0 mt-2 z-40 w-64 p-3 rounded-lg bg-obsidian-850 border border-obsidian-700 text-xs text-obsidian-200 shadow-xl">
            <strong className="text-white block mb-1">Formula & Denominator</strong>
            Usable text defined as non-empty call transcript or &gt;0 meeting turns. Numerator: {metrics.usable_transcript_count}, Denominator: {metrics.usable_transcript_denominator} total records.
          </div>
        )}
      </div>

      {/* 3. Call Coverage vs Meeting Coverage */}
      <div className="p-3.5 rounded-lg bg-obsidian-900 border border-obsidian-800 hover:border-obsidian-700 transition relative group">
        <div className="flex items-center justify-between text-obsidian-400 mb-1">
          <span className="text-xs font-medium uppercase tracking-wider">Type Breakdown</span>
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); setActiveTooltip(activeTooltip === 'type' ? null : 'type'); }}
            className="text-obsidian-500 hover:text-obsidian-300"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-lg font-bold font-mono text-cyan-400">
              {metrics.call_transcript_count}/{metrics.call_transcript_denominator}
            </div>
            <div className="text-[10px] text-obsidian-400 uppercase tracking-wider">Calls ({metrics.call_transcript_coverage_rate}%)</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold font-mono text-indigo-400">
              {metrics.meeting_transcript_count}/{metrics.meeting_transcript_denominator}
            </div>
            <div className="text-[10px] text-obsidian-400 uppercase tracking-wider">Mtgs ({metrics.meeting_transcript_coverage_rate}%)</div>
          </div>
        </div>

        {activeTooltip === 'type' && (
          <div className="absolute top-full left-0 mt-2 z-40 w-64 p-3 rounded-lg bg-obsidian-850 border border-obsidian-700 text-xs text-obsidian-200 shadow-xl">
            <strong className="text-white block mb-1">Separate Denominators</strong>
            Calls: 10 usable transcripts out of 30 calls (33.3%). Meetings: {metrics.meeting_transcript_count} usable transcripts out of 14 scheduled meetings ({metrics.meeting_transcript_coverage_rate}%).
          </div>
        )}
      </div>

      {/* 4. Telephony Connection Rate */}
      <div className="p-3.5 rounded-lg bg-obsidian-900 border border-obsidian-800 hover:border-obsidian-700 transition relative group">
        <div className="flex items-center justify-between text-obsidian-400 mb-1">
          <span className="text-xs font-medium uppercase tracking-wider">Source Connect Rate</span>
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); setActiveTooltip(activeTooltip === 'connect' ? null : 'connect'); }}
            className="text-obsidian-500 hover:text-obsidian-300"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="text-2xl font-bold font-mono text-amber-400">
          {metrics.source_reported_connection_rate}%
        </div>
        <div className="text-[11px] text-obsidian-400 mt-1 font-mono">
          <span className="text-white font-semibold">{metrics.source_reported_connected_calls}</span>
          <span> / {metrics.source_reported_evaluated_calls} calls</span>
        </div>

        {activeTooltip === 'connect' && (
          <div className="absolute top-full right-0 mt-2 z-40 w-72 p-3 rounded-lg bg-obsidian-850 border border-obsidian-700 text-xs text-obsidian-200 shadow-xl">
            <strong className="text-white block mb-1">Source Metadata Rate (Caveat)</strong>
            Numerator: calls with <code>is_connected === true</code> (11 calls). Denominator: all calls with non-null is_connected (30).
            <span className="block mt-1 text-amber-300 text-[11px]">
              *Note: B11 &amp; B14 report connected=true but are silent/unresponsive. C04 reports connected=false but Arun leaves 95s voicemail.
            </span>
          </div>
        )}
      </div>

      {/* 5. Review Backlog */}
      <div 
        onClick={() => onFilterByReview?.('unreviewed')}
        className="p-3.5 rounded-lg bg-obsidian-900 border border-obsidian-800 hover:border-obsidian-700 transition cursor-pointer"
      >
        <div className="flex items-center justify-between text-obsidian-400 mb-1">
          <span className="text-xs font-medium uppercase tracking-wider">Review Status</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-white">
            {metrics.review_counts.reviewed}
          </span>
          <span className="text-xs text-obsidian-400 font-mono">
            / {metrics.total_selected_records} done
          </span>
        </div>
        <div className="text-[11px] text-amber-400 mt-1 font-mono flex items-center gap-1.5">
          <span>{metrics.review_counts.unreviewed} Pending</span>
          {metrics.review_counts.pending_re_review > 0 && (
            <span className="text-rose-400">({metrics.review_counts.pending_re_review} Re-check)</span>
          )}
        </div>
      </div>

      {/* 6. Discrepancies & Overrides */}
      <div className="p-3.5 rounded-lg bg-obsidian-900 border border-obsidian-800 hover:border-obsidian-700 transition">
        <div className="flex items-center justify-between text-obsidian-400 mb-1">
          <span className="text-xs font-medium uppercase tracking-wider">Integrity Alerts</span>
        </div>
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-xl font-bold font-mono text-amber-400">
              {metrics.discrepancies_detected_count}
            </div>
            <div className="text-[10px] text-obsidian-400 uppercase tracking-wider">Discrepancies</div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold font-mono text-cyan-400">
              {metrics.manual_corrections_count}
            </div>
            <div className="text-[10px] text-obsidian-400 uppercase tracking-wider">Overrides</div>
          </div>
        </div>
        <div className="text-[10px] text-obsidian-400 mt-1 truncate">
          C10, C06, C09 flagged
        </div>
      </div>

    </div>
  );
};
