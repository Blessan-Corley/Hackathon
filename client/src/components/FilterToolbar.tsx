import React from 'react';
import { Search, Filter, X, Users, PhoneCall, Calendar, CheckSquare } from 'lucide-react';
import { DashboardMetrics, RouteCategory, ReviewState } from '../types/index.js';

interface FilterToolbarProps {
  metrics: DashboardMetrics;
  selectedPerson: string;
  onSelectPerson: (person: string) => void;
  selectedSourceType: string;
  onSelectSourceType: (type: string) => void;
  selectedRoute: string;
  onSelectRoute: (route: string) => void;
  selectedReviewState: string;
  onSelectReviewState: (state: string) => void;
  selectedTranscriptFilter: string;
  onSelectTranscriptFilter: (filter: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onResetFilters: () => void;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  metrics,
  selectedPerson,
  onSelectPerson,
  selectedSourceType,
  onSelectSourceType,
  selectedRoute,
  onSelectRoute,
  selectedReviewState,
  onSelectReviewState,
  selectedTranscriptFilter,
  onSelectTranscriptFilter,
  searchQuery,
  onSearchChange,
  onResetFilters
}) => {
  const isFiltered = 
    selectedPerson !== 'all' || 
    selectedSourceType !== 'all' || 
    selectedRoute !== 'all' || 
    selectedReviewState !== 'all' || 
    selectedTranscriptFilter !== 'all' || 
    searchQuery.trim().length > 0;

  return (
    <div className="bg-obsidian-900 border border-obsidian-800 rounded-lg p-3.5 mb-5 shadow-sm space-y-3">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-obsidian-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search records, transcripts, findings (e.g. 'Meadowbrick', 'M07', 'StoreHarbor')..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-md bg-obsidian-850 border border-obsidian-750 text-xs text-white placeholder-obsidian-500 focus:outline-none focus:border-emerald-500 transition"
          />
          {searchQuery && (
            <button 
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-obsidian-500 hover:text-obsidian-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Source Type Segmented Control */}
        <div className="flex items-center rounded-md bg-obsidian-850 border border-obsidian-750 p-0.5">
          <button
            onClick={() => onSelectSourceType('all')}
            className={`px-3 py-1 text-xs rounded font-medium transition ${
              selectedSourceType === 'all' 
                ? 'bg-obsidian-700 text-white shadow-sm' 
                : 'text-obsidian-400 hover:text-obsidian-200'
            }`}
          >
            All ({metrics.total_selected_records})
          </button>
          <button
            onClick={() => onSelectSourceType('call')}
            className={`px-3 py-1 text-xs rounded font-medium transition flex items-center gap-1.5 ${
              selectedSourceType === 'call' 
                ? 'bg-obsidian-700 text-cyan-300 shadow-sm' 
                : 'text-obsidian-400 hover:text-obsidian-200'
            }`}
          >
            <PhoneCall className="w-3 h-3" />
            Calls ({metrics.total_calls})
          </button>
          <button
            onClick={() => onSelectSourceType('meeting')}
            className={`px-3 py-1 text-xs rounded font-medium transition flex items-center gap-1.5 ${
              selectedSourceType === 'meeting' 
                ? 'bg-obsidian-700 text-indigo-300 shadow-sm' 
                : 'text-obsidian-400 hover:text-obsidian-200'
            }`}
          >
            <Calendar className="w-3 h-3" />
            Meetings ({metrics.total_meetings})
          </button>
        </div>

      </div>

      {/* Row 2: Dropdowns for Person, Route, Review State, and Usable Transcript */}
      <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-obsidian-800 text-xs">
        
        {/* Person Selector: Strictly separated into Call Reps vs Meeting Organizers! */}
        <div className="flex items-center gap-1.5">
          <span className="text-obsidian-400 font-medium">Person:</span>
          <select
            value={selectedPerson}
            onChange={(e) => onSelectPerson(e.target.value)}
            className="px-2.5 py-1 rounded bg-obsidian-850 border border-obsidian-750 text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
          >
            <option value="all">All Reps &amp; Organizers</option>
            <optgroup label="── CALL REPS (Sales Reps) ──">
              {metrics.activity_by_person.call_reps.map(r => (
                <option key={r.name} value={r.name}>
                  {r.name} ({r.total_calls} calls, {r.usable_transcripts} texts)
                </option>
              ))}
            </optgroup>
            <optgroup label="── MEETING ORGANIZERS (Calendar Owners) ──">
              {metrics.activity_by_person.meeting_organizers.map(o => (
                <option key={o.email} value={o.email}>
                  {o.email} ({o.total_meetings} mtgs)
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Route Taxonomy Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-obsidian-400 font-medium">Route:</span>
          <select
            value={selectedRoute}
            onChange={(e) => onSelectRoute(e.target.value)}
            className="px-2.5 py-1 rounded bg-obsidian-850 border border-obsidian-750 text-white text-xs focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Destinations</option>
            <option value="deal_next_steps">Deal Next Steps ({metrics.route_distribution.deal_next_steps})</option>
            <option value="sales_coaching">Sales Coaching ({metrics.route_distribution.sales_coaching})</option>
            <option value="customer_success">Customer Success ({metrics.route_distribution.customer_success})</option>
            <option value="customer_support">Customer Support ({metrics.route_distribution.customer_support})</option>
            <option value="partnerships">Partnerships ({metrics.route_distribution.partnerships})</option>
            <option value="internal_ops">Internal / Ops ({metrics.route_distribution.internal_ops})</option>
            <option value="intake_exception">Intake Exceptions ({metrics.route_distribution.intake_exception})</option>
          </select>
        </div>

        {/* Review State Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-obsidian-400 font-medium">Review State:</span>
          <select
            value={selectedReviewState}
            onChange={(e) => onSelectReviewState(e.target.value)}
            className="px-2.5 py-1 rounded bg-obsidian-850 border border-obsidian-750 text-white text-xs focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All States</option>
            <option value="unreviewed">Unreviewed ({metrics.review_counts.unreviewed})</option>
            <option value="reviewed">Reviewed ({metrics.review_counts.reviewed})</option>
            <option value="pending_re-review">Needs Re-review ({metrics.review_counts.pending_re_review})</option>
          </select>
        </div>

        {/* Usable Transcript Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-obsidian-400 font-medium">Transcript:</span>
          <select
            value={selectedTranscriptFilter}
            onChange={(e) => onSelectTranscriptFilter(e.target.value)}
            className="px-2.5 py-1 rounded bg-obsidian-850 border border-obsidian-750 text-white text-xs focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Records</option>
            <option value="true">Usable Speech Only ({metrics.usable_transcript_count})</option>
            <option value="false">Silent / Telephony Only ({metrics.usable_transcript_denominator - metrics.usable_transcript_count})</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        {isFiltered && (
          <button
            onClick={onResetFilters}
            className="ml-auto px-2 py-1 rounded text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 border border-rose-900/50 flex items-center gap-1 transition"
          >
            <X className="w-3 h-3" />
            Reset Filters
          </button>
        )}

      </div>
    </div>
  );
};
