import React from 'react';
import { Search, X, Users, PhoneCall, Calendar, Filter, Sparkles, Mic, CheckCircle2 } from 'lucide-react';
import { DashboardMetrics } from '../types/index.js';
import { CustomFilterDropdown, DropdownOption } from './CustomFilterDropdown.js';

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

  // 1. Team Member Options
  const personOptions: DropdownOption[] = [
    { value: 'all', label: 'All Team Members' },
    ...metrics.activity_by_person.call_reps.map((r) => ({
      value: r.name,
      label: r.name,
      badge: `${r.total_calls} calls`,
      group: 'Call Reps',
      dotColor: 'bg-sky-400',
      theme: { bg: 'bg-sky-500/15', text: 'text-sky-300', border: 'border-sky-500/40' }
    })),
    ...metrics.activity_by_person.meeting_organizers.map((o) => ({
      value: o.email,
      label: o.email,
      badge: `${o.total_meetings} mtgs`,
      group: 'Meeting Organizers',
      dotColor: 'bg-indigo-400',
      theme: { bg: 'bg-indigo-500/15', text: 'text-indigo-300', border: 'border-indigo-500/40' }
    }))
  ];

  // 2. Destination Route Options (Rich Semantic Theme Colors)
  const routeOptions: DropdownOption[] = [
    { value: 'all', label: 'All Destination Routes' },
    {
      value: 'deal_next_steps',
      label: 'Deal Next Steps',
      badge: metrics.route_distribution.deal_next_steps,
      dotColor: 'bg-emerald-400',
      glow: 'shadow-[0_0_8px_rgba(52,211,153,0.5)]',
      theme: { bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/40' }
    },
    {
      value: 'sales_coaching',
      label: 'Sales Coaching',
      badge: metrics.route_distribution.sales_coaching,
      dotColor: 'bg-amber-400',
      glow: 'shadow-[0_0_8px_rgba(251,191,36,0.5)]',
      theme: { bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/40' }
    },
    {
      value: 'customer_success',
      label: 'Customer Success',
      badge: metrics.route_distribution.customer_success,
      dotColor: 'bg-blue-400',
      glow: 'shadow-[0_0_8px_rgba(96,165,250,0.5)]',
      theme: { bg: 'bg-blue-500/15', text: 'text-blue-300', border: 'border-blue-500/40' }
    },
    {
      value: 'customer_support',
      label: 'Customer Support',
      badge: metrics.route_distribution.customer_support,
      dotColor: 'bg-purple-400',
      glow: 'shadow-[0_0_8px_rgba(192,132,252,0.5)]',
      theme: { bg: 'bg-purple-500/15', text: 'text-purple-300', border: 'border-purple-500/40' }
    },
    {
      value: 'partnerships',
      label: 'Partnerships',
      badge: metrics.route_distribution.partnerships,
      dotColor: 'bg-cyan-400',
      glow: 'shadow-[0_0_8px_rgba(34,211,238,0.5)]',
      theme: { bg: 'bg-cyan-500/15', text: 'text-cyan-300', border: 'border-cyan-500/40' }
    },
    {
      value: 'internal_ops',
      label: 'Internal / Ops',
      badge: metrics.route_distribution.internal_ops,
      dotColor: 'bg-zinc-400',
      theme: { bg: 'bg-zinc-500/15', text: 'text-zinc-300', border: 'border-zinc-500/40' }
    },
    {
      value: 'intake_exception',
      label: 'Intake Exceptions',
      badge: metrics.route_distribution.intake_exception,
      dotColor: 'bg-rose-400',
      glow: 'shadow-[0_0_8px_rgba(251,113,133,0.5)]',
      theme: { bg: 'bg-rose-500/15', text: 'text-rose-300', border: 'border-rose-500/40' }
    }
  ];

  // 3. Review Status Options (Matching ReviewStateDropdown)
  const reviewOptions: DropdownOption[] = [
    { value: 'all', label: 'All Review States' },
    {
      value: 'unreviewed',
      label: 'Pending Review',
      badge: metrics.review_counts.unreviewed,
      dotColor: 'bg-amber-400',
      glow: 'shadow-[0_0_8px_rgba(251,191,36,0.5)]',
      theme: { bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/40' }
    },
    {
      value: 'reviewed',
      label: 'Reviewed',
      badge: metrics.review_counts.reviewed,
      dotColor: 'bg-emerald-400',
      glow: 'shadow-[0_0_8px_rgba(52,211,153,0.5)]',
      theme: { bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/40' }
    },
    {
      value: 'pending_re-review',
      label: 'Needs Re-review',
      badge: metrics.review_counts.pending_re_review,
      dotColor: 'bg-rose-400',
      glow: 'shadow-[0_0_8px_rgba(251,113,133,0.5)]',
      theme: { bg: 'bg-rose-500/15', text: 'text-rose-300', border: 'border-rose-500/40' }
    }
  ];

  // 4. Speech Coverage Options
  const speechOptions: DropdownOption[] = [
    { value: 'all', label: 'All Content' },
    {
      value: 'true',
      label: 'Verified Speech',
      badge: metrics.usable_transcript_count,
      dotColor: 'bg-emerald-400',
      glow: 'shadow-[0_0_8px_rgba(52,211,153,0.5)]',
      theme: { bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/40' }
    },
    {
      value: 'false',
      label: 'Silent / Telephony',
      badge: metrics.usable_transcript_denominator - metrics.usable_transcript_count,
      dotColor: 'bg-zinc-500',
      theme: { bg: 'bg-zinc-500/15', text: 'text-zinc-300', border: 'border-zinc-500/40' }
    }
  ];

  return (
    <div className="glass-card rounded-2xl p-3.5 mb-5 space-y-3 relative z-20">
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

      {/* Luxury Colored Filter Dropdowns */}
      <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-white/[0.05] text-xs">
        
        {/* 1. Team Member Dropdown */}
        <CustomFilterDropdown
          value={selectedPerson}
          onChange={onSelectPerson}
          options={personOptions}
          placeholder="All Team Members"
          icon={<Users className="w-3.5 h-3.5" />}
          selectAriaLabel="Team Member"
        />

        {/* 2. Destination Route Dropdown */}
        <CustomFilterDropdown
          value={selectedRoute}
          onChange={onSelectRoute}
          options={routeOptions}
          placeholder="All Destination Routes"
          icon={<Filter className="w-3.5 h-3.5" />}
          selectAriaLabel="Destination Route"
        />

        {/* 3. Review Status Dropdown */}
        <CustomFilterDropdown
          value={selectedReviewState}
          onChange={onSelectReviewState}
          options={reviewOptions}
          placeholder="All Review States"
          icon={<CheckCircle2 className="w-3.5 h-3.5" />}
          selectAriaLabel="Review State"
        />

        {/* 4. Speech Coverage Dropdown */}
        <CustomFilterDropdown
          value={selectedTranscriptFilter}
          onChange={onSelectTranscriptFilter}
          options={speechOptions}
          placeholder="All Content"
          icon={<Mic className="w-3.5 h-3.5" />}
          selectAriaLabel="Speech Coverage"
        />

        {/* Reset Filter Button */}
        {isFiltered && (
          <button
            onClick={onResetFilters}
            className="ml-auto px-2.5 py-1 rounded-lg text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 flex items-center gap-1 transition"
          >
            <X className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        )}

      </div>
    </div>
  );
};
