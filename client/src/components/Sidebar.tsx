import React, { useState } from 'react';
import { 
  Inbox, 
  ShieldAlert, 
  Users, 
  FileText, 
  Download, 
  SlidersHorizontal, 
  PanelLeftClose, 
  PanelLeft, 
  Pin,
  TrendingUp, 
  Headphones, 
  GraduationCap, 
  Network, 
  Building2, 
  AlertOctagon,
  HeartHandshake,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { DashboardMetrics, RouteCategory } from '../types/index.js';

export type WorkspaceView = 'inbox' | 'radar' | 'team';

export interface SidebarProps {
  isPinned: boolean;
  onTogglePin: () => void;
  activeView: WorkspaceView;
  onSelectView: (view: WorkspaceView) => void;
  selectedRoute: string;
  onSelectRoute: (route: string) => void;
  metrics: DashboardMetrics | null;
  onOpenBrief: () => void;
  onOpenExport: () => void;
  onOpenSyncDrawer: () => void;
  isSyncOpen: boolean;
  discrepanciesCount: number;
}

const DESTINATION_ITEMS: Array<{
  id: RouteCategory;
  label: string;
  icon: React.ReactNode;
  colorClass: string;
  activeClass: string;
}> = [
  {
    id: 'deal_next_steps',
    label: 'Deal Next Steps',
    icon: <TrendingUp className="w-4 h-4" />,
    colorClass: 'text-emerald-400',
    activeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
  },
  {
    id: 'customer_support',
    label: 'Customer Support',
    icon: <Headphones className="w-4 h-4" />,
    colorClass: 'text-purple-400',
    activeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/30'
  },
  {
    id: 'sales_coaching',
    label: 'Sales Coaching',
    icon: <GraduationCap className="w-4 h-4" />,
    colorClass: 'text-amber-400',
    activeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30'
  },
  {
    id: 'customer_success',
    label: 'Customer Success',
    icon: <HeartHandshake className="w-4 h-4" />,
    colorClass: 'text-blue-400',
    activeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30'
  },
  {
    id: 'partnerships',
    label: 'Partnerships',
    icon: <Network className="w-4 h-4" />,
    colorClass: 'text-cyan-400',
    activeClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
  },
  {
    id: 'internal_ops',
    label: 'Internal / Ops',
    icon: <Building2 className="w-4 h-4" />,
    colorClass: 'text-zinc-400',
    activeClass: 'bg-zinc-500/15 text-zinc-300 border-zinc-500/30'
  },
  {
    id: 'intake_exception',
    label: 'Intake Exceptions',
    icon: <AlertOctagon className="w-4 h-4" />,
    colorClass: 'text-rose-400',
    activeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30'
  }
];

export const Sidebar: React.FC<SidebarProps> = ({
  isPinned,
  onTogglePin,
  activeView,
  onSelectView,
  selectedRoute,
  onSelectRoute,
  metrics,
  onOpenBrief,
  onOpenExport,
  onOpenSyncDrawer,
  isSyncOpen,
  discrepanciesCount
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isExpanded = isPinned || isHovered;

  return (
    <div 
      className={`relative shrink-0 transition-all duration-300 ease-in-out ${
        isPinned ? 'w-64' : 'w-16'
      }`}
    >
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`border-r border-white/[0.08] bg-dark-900/98 backdrop-blur-2xl flex flex-col transition-all duration-300 ease-in-out z-40 select-none fixed top-0 left-0 h-screen overflow-hidden ${
          isExpanded 
            ? 'w-64 shadow-2xl shadow-black/90 ring-1 ring-white/10' 
            : 'w-16'
        }`}
      >
        {/* Brand & Pin Lock Header */}
        <div className="h-16 border-b border-white/[0.08] px-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-[1px] shadow-lg shadow-emerald-500/10 shrink-0">
              <div className="h-full w-full bg-dark-950 rounded-[11px] flex items-center justify-center">
                <span className="text-emerald-400 font-bold text-sm tracking-tighter">SN</span>
              </div>
            </div>
            
            {isExpanded && (
              <div className="animate-in fade-in-0 duration-200 truncate">
                <div className="text-sm font-bold text-white tracking-tight leading-none truncate">
                  SpendNest
                </div>
                <div className="text-[11px] font-medium text-dark-400 mt-1 truncate">
                  Revenue Intelligence
                </div>
              </div>
            )}
          </div>

          {/* Pin Toggle Button */}
          {isExpanded && (
            <button
              type="button"
              onClick={onTogglePin}
              className={`p-1.5 rounded-lg transition shrink-0 ${
                isPinned 
                  ? 'text-emerald-400 bg-emerald-500/15 border border-emerald-500/30' 
                  : 'text-dark-400 hover:text-white hover:bg-dark-800'
              }`}
              title={isPinned ? 'Unpin sidebar (auto-collapse on hover)' : 'Pin sidebar open'}
              aria-label={isPinned ? 'Unpin sidebar' : 'Pin sidebar open'}
            >
              <Pin className={`w-3.5 h-3.5 transition-transform ${isPinned ? 'rotate-45' : ''}`} />
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-2.5 space-y-6 custom-scrollbar">
          
          {/* Workspace Views */}
          <div className="space-y-1">
            {isExpanded ? (
              <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-dark-500 font-bold">
                WORKSPACE
              </div>
            ) : (
              <div className="h-2" />
            )}

            {/* 1. Triage Inbox */}
            <button
              type="button"
              onClick={() => {
                onSelectView('inbox');
                onSelectRoute('all');
              }}
              className={`w-full px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                activeView === 'inbox' && selectedRoute === 'all'
                  ? 'bg-dark-800 text-white shadow-sm border border-white/[0.08]'
                  : 'text-dark-300 hover:text-white hover:bg-dark-850'
              }`}
              title="Triage Inbox (All Records)"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Inbox className="w-4 h-4 text-emerald-400 shrink-0" />
                {isExpanded && <span className="truncate">Triage Inbox</span>}
              </div>
              {isExpanded && metrics && (
                <span className="px-2 py-0.5 rounded-md text-[10px] bg-dark-850 border border-white/[0.06] text-dark-300 font-mono shrink-0">
                  {metrics.total_selected_records}
                </span>
              )}
            </button>

            {/* 2. Discrepancy Radar */}
            <button
              type="button"
              onClick={() => onSelectView('radar')}
              className={`w-full px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                activeView === 'radar'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  : 'text-dark-300 hover:text-white hover:bg-dark-850'
              }`}
              title="Discrepancy Radar (4 Telemetry Inconsistencies)"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative shrink-0">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  {discrepanciesCount > 0 && !isExpanded && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-dark-900 animate-pulse" />
                  )}
                </div>
                {isExpanded && <span className="truncate">Discrepancy Radar</span>}
              </div>
              {isExpanded && discrepanciesCount > 0 && (
                <span className="px-2 py-0.5 rounded-md text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono font-bold animate-pulse shrink-0">
                  {discrepanciesCount}
                </span>
              )}
            </button>

            {/* 3. Team Scorecard */}
            <button
              type="button"
              onClick={() => onSelectView('team')}
              className={`w-full px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                activeView === 'team'
                  ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                  : 'text-dark-300 hover:text-white hover:bg-dark-850'
              }`}
              title="Team Scorecard (5 Call Reps & Meeting Organizers)"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Users className="w-4 h-4 text-sky-400 shrink-0" />
                {isExpanded && <span className="truncate">Team Scorecard</span>}
              </div>
              {isExpanded && (
                <span className="px-2 py-0.5 rounded-md text-[10px] bg-dark-850 border border-white/[0.06] text-dark-300 font-mono shrink-0">
                  5 Reps
                </span>
              )}
            </button>
          </div>

          {/* Destination Queues */}
          <div className="space-y-1">
            {isExpanded ? (
              <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-dark-500 font-bold">
                QUEUES
              </div>
            ) : (
              <div className="my-2 border-t border-white/[0.06]" />
            )}

            {DESTINATION_ITEMS.map((item) => {
              const isSelected = selectedRoute === item.id;
              const count = metrics?.route_distribution[item.id] || 0;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectView('inbox');
                    onSelectRoute(isSelected ? 'all' : item.id);
                  }}
                  className={`w-full px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center justify-between transition cursor-pointer ${
                    isSelected
                      ? `${item.activeClass} border shadow-sm`
                      : 'text-dark-300 hover:text-white hover:bg-dark-850'
                  }`}
                  title={`${item.label} (${count} records)`}
                >
                  <div className="flex items-center gap-2.5 truncate min-w-0">
                    <span className={`${item.colorClass} shrink-0`}>{item.icon}</span>
                    {isExpanded && <span className="truncate">{item.label}</span>}
                  </div>
                  {isExpanded && (
                    <span className="text-[10px] font-mono text-dark-400 ml-1 shrink-0">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Direct Operations Tools */}
          <div className="space-y-1">
            {isExpanded ? (
              <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-dark-500 font-bold">
                OPERATIONS
              </div>
            ) : (
              <div className="my-2 border-t border-white/[0.06]" />
            )}

            {/* Daily Briefing */}
            <button
              type="button"
              onClick={onOpenBrief}
              className="w-full px-2.5 py-2 rounded-xl text-xs font-semibold text-dark-300 hover:text-white hover:bg-dark-850 flex items-center justify-between transition cursor-pointer"
              title="Daily Briefing (Fixed 21 Aug 2026)"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                {isExpanded && <span className="truncate">Daily Briefing</span>}
              </div>
              {isExpanded && (
                <span className="text-[10px] text-emerald-400 font-mono shrink-0">
                  Fixed 21 Aug
                </span>
              )}
            </button>

            {/* Export Hub */}
            <button
              type="button"
              onClick={onOpenExport}
              className="w-full px-2.5 py-2 rounded-xl text-xs font-semibold text-dark-300 hover:text-white hover:bg-dark-850 flex items-center justify-between transition cursor-pointer"
              title="Export Hub (ZIP & CSV Manifest)"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Download className="w-4 h-4 text-sky-400 shrink-0" />
                {isExpanded && <span className="truncate">Export Hub</span>}
              </div>
              {isExpanded && (
                <span className="text-[10px] text-dark-400 font-mono shrink-0">
                  ZIP / CSV
                </span>
              )}
            </button>

            {/* Sync & Replay Feeds */}
            <button
              type="button"
              onClick={onOpenSyncDrawer}
              className={`w-full px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                isSyncOpen
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40'
                  : 'text-dark-300 hover:text-white hover:bg-dark-850'
              }`}
              title="Sync & Replay Feeds (5-Step Contract Audit)"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <SlidersHorizontal className="w-4 h-4 text-emerald-400 shrink-0" />
                {isExpanded && <span className="truncate">Replay Engine</span>}
              </div>
              {isExpanded && (
                <span className="text-[10px] text-dark-400 font-mono shrink-0">
                  5 Steps
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Bottom Status & Hover Hint Badge */}
        <div className="p-3 border-t border-white/[0.08] bg-dark-950/80 shrink-0">
          {isExpanded ? (
            <div className="space-y-1 animate-in fade-in-0 duration-200">
              <div className="flex items-center gap-2 text-[11px] font-medium text-dark-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Pipeline Live • 21 Aug 2026</span>
              </div>
              <div className="text-[10px] text-dark-500 font-mono">
                {isPinned ? 'Sidebar pinned open' : 'Hover active • auto-collapses'}
              </div>
            </div>
          ) : (
            <div className="flex justify-center" title="Hover to expand navigation sidebar">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          )}
        </div>

      </aside>
    </div>
  );
};
