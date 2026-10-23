import React from 'react';
import { 
  Sparkles, 
  FileText, 
  Download, 
  SlidersHorizontal, 
  Layers, 
  Calendar, 
  MapPin, 
  BellRing,
  ArrowUpRight,
  PanelLeft
} from 'lucide-react';

interface HeaderProps {
  onOpenBrief: () => void;
  onOpenExport: () => void;
  onOpenSyncDrawer: () => void;
  isSyncOpen: boolean;
  discrepanciesCount: number;
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenBrief,
  onOpenExport,
  onOpenSyncDrawer,
  isSyncOpen,
  discrepanciesCount,
  onToggleSidebar,
  isSidebarCollapsed
}) => {
  return (
    <header className="border-b border-white/[0.08] bg-dark-900/80 backdrop-blur-md sticky top-0 z-30 px-6 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Brand & Context */}
        <div className="flex items-center gap-3.5">
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="p-2 rounded-xl bg-dark-850 hover:bg-dark-800 border border-white/[0.08] text-dark-400 hover:text-white transition"
              title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <PanelLeft className="w-4 h-4" />
            </button>
          )}

          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-[1px] shadow-lg shadow-emerald-500/10">
            <div className="h-full w-full bg-dark-950 rounded-[11px] flex items-center justify-center">
              <span className="text-emerald-400 font-bold text-sm tracking-tighter">SN</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-base font-bold text-white tracking-tight">
                SpendNest
              </h1>
              <span className="text-xs font-medium text-dark-400">/</span>
              <span className="text-xs font-medium text-dark-300 tracking-normal">
                Revenue Intelligence
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-[11px] text-dark-400 mt-0.5 font-medium">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Friday, August 21, 2026
              </span>
              <span>•</span>
              <span className="text-dark-400">Asia/Kolkata</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          
          {/* Daily Briefing Button */}
          <button
            onClick={onOpenBrief}
            className="px-3 py-1.5 rounded-lg bg-dark-850 hover:bg-dark-800 border border-white/[0.08] hover:border-white/[0.14] text-xs font-medium text-dark-200 hover:text-white flex items-center gap-2 transition shadow-sm relative"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Daily Briefing</span>
            {discrepanciesCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-300 text-[10px] font-semibold border border-amber-500/30">
                {discrepanciesCount}
              </span>
            )}
          </button>

          {/* Export Dossiers */}
          <button
            onClick={onOpenExport}
            className="px-3 py-1.5 rounded-lg bg-dark-850 hover:bg-dark-800 border border-white/[0.08] hover:border-white/[0.14] text-xs font-medium text-dark-200 hover:text-white flex items-center gap-2 transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>Export Hub</span>
          </button>

          {/* Data Connector & Replay Toggle */}
          <button
            onClick={onOpenSyncDrawer}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition shadow-sm border ${
              isSyncOpen 
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' 
                : 'bg-dark-850 hover:bg-dark-800 border-white/[0.08] text-dark-200 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Sync &amp; Replay Feeds</span>
          </button>

        </div>

      </div>
    </header>
  );
};
