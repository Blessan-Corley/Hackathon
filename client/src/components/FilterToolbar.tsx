import React from 'react';
import { Search, X, Users, PhoneCall, Calendar, Filter, Sparkles, ChevronDown } from 'lucide-react';
import { DashboardMetrics } from '../types/index.js';

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
    <div className="glass-card rounded-2xl p-3.5 mb-5 space-y-3">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-dark-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search conversations, accounts, or citations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-9 py-2 rounded-xl bg-dark-900 border border-white/[0.08] text-xs text-white placeholder-dark-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition"
          />
          {searchQuery && (
            <button 
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Source Channel Segmented Control */}
        <div className="flex items-center rounded-xl bg-dark-900 border border-white/[0.08] p-1">
          <button
            onClick={() => onSelectSourceType('all')}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition ${
              selectedSourceType === 'all' 
                ? 'bg-dark-800 text-white shadow-sm' 
                : 'text-dark-400 hover:text-dark-200'
            }`}
          >
            All ({metrics.total_selected_records})
          </button>
          <button
            onClick={() => onSelectSourceType('call')}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition flex items-center gap-1.5 ${
              selectedSourceType === 'call' 
                ? 'bg-dark-800 text-sky-400 shadow-sm' 
                : 'text-dark-400 hover:text-dark-200'
            }`}
          >
            <PhoneCall className="w-3 h-3" />
            Calls ({metrics.total_calls})
          </button>
          <button
            onClick={() => onSelectSourceType('meeting')}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition flex items-center gap-1.5 ${
              selectedSourceType === 'meeting' 
                ? 'bg-dark-800 text-indigo-400 shadow-sm' 
                : 'text-dark-400 hover:text-dark-200'
            }`}
          >
            <Calendar className="w-3 h-3" />
            Meetings ({metrics.total_meetings})
          </button>
        </div>

      </div>

      {/* Filter Selectors */}
      <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-white/[0.05] text-xs">
        
        {/* Person Selector */}
        <div className="relative">
          <select
            value={selectedPerson}
            onChange={(e) => onSelectPerson(e.target.value)}
            className="appearance-none bg-dark-900 hover:bg-dark-850 border border-white/[0.08] hover:border-white/[0.14] text-dark-200 text-xs font-medium rounded-xl pl-3 pr-8 py-1.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition cursor-pointer shadow-sm"
          >
            <option value="all">All Team Members</option>
            <optgroup label="── CALL REPS ──">
              {metrics.activity_by_person.call_reps.map(r => (
                <option key={r.name} value={r.name}>
                  {r.name} ({r.total_calls} calls)
                </option>
              ))}
            </optgroup>
            <optgroup label="── MEETING ORGANIZERS ──">
              {metrics.activity_by_person.meeting_organizers.map(o => (
                <option key={o.email} value={o.email}>
                  {o.email} ({o.total_meetings} mtgs)
                </option>
              ))}
            </optgroup>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-dark-400" />
        </div>

        {/* Route Taxonomy */}
        <div className="relative">
          <select
            value={selectedRoute}
            onChange={(e) => onSelectRoute(e.target.value)}
            className="appearance-none bg-dark-900 hover:bg-dark-850 border border-white/[0.08] hover:border-white/[0.14] text-dark-200 text-xs font-medium rounded-xl pl-3 pr-8 py-1.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition cursor-pointer shadow-sm"
          >
            <option value="all">All Destination Routes</option>
            <option value="deal_next_steps">Deal Next Steps ({metrics.route_distribution.deal_next_steps})</option>
            <option value="sales_coaching">Sales Coaching ({metrics.route_distribution.sales_coaching})</option>
            <option value="customer_success">Customer Success ({metrics.route_distribution.customer_success})</option>
            <option value="customer_support">Customer Support ({metrics.route_distribution.customer_support})</option>
            <option value="partnerships">Partnerships ({metrics.route_distribution.partnerships})</option>
            <option value="internal_ops">Internal / Ops ({metrics.route_distribution.internal_ops})</option>
            <option value="intake_exception">Intake Exceptions ({metrics.route_distribution.intake_exception})</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-dark-400" />
        </div>

        {/* Review Status */}
        <div className="relative">
          <select
            value={selectedReviewState}
            onChange={(e) => onSelectReviewState(e.target.value)}
            className="appearance-none bg-dark-900 hover:bg-dark-850 border border-white/[0.08] hover:border-white/[0.14] text-dark-200 text-xs font-medium rounded-xl pl-3 pr-8 py-1.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition cursor-pointer shadow-sm"
          >
            <option value="all">All Review States</option>
            <option value="unreviewed">Pending Review ({metrics.review_counts.unreviewed})</option>
            <option value="reviewed">Reviewed ({metrics.review_counts.reviewed})</option>
            <option value="pending_re-review">Needs Re-review ({metrics.review_counts.pending_re_review})</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-dark-400" />
        </div>

        {/* Speech Coverage */}
        <div className="relative">
          <select
            value={selectedTranscriptFilter}
            onChange={(e) => onSelectTranscriptFilter(e.target.value)}
            className="appearance-none bg-dark-900 hover:bg-dark-850 border border-white/[0.08] hover:border-white/[0.14] text-dark-200 text-xs font-medium rounded-xl pl-3 pr-8 py-1.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition cursor-pointer shadow-sm"
          >
            <option value="all">All Content</option>
            <option value="true">Verified Speech ({metrics.usable_transcript_count})</option>
            <option value="false">Silent / Telephony ({metrics.usable_transcript_denominator - metrics.usable_transcript_count})</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-dark-400" />
        </div>

        {/* Reset Filter Button */}
        {isFiltered && (
          <button
            onClick={onResetFilters}
            className="ml-auto px-2.5 py-1 rounded-lg text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 flex items-center gap-1 transition"
          >
            <X className="w-3 h-3" />
            Reset Filters
          </button>
        )}

      </div>
    </div>
  );
};
