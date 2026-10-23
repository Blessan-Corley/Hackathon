import React from 'react';
import { ShieldCheck, FileSpreadsheet, FileText, Award, RefreshCw, Calendar, MapPin } from 'lucide-react';

interface HeaderProps {
  onOpenBrief: () => void;
  onOpenExport: () => void;
  onOpenRubric: () => void;
  discrepanciesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenBrief,
  onOpenExport,
  onOpenRubric,
  discrepanciesCount
}) => {
  return (
    <header className="border-b border-obsidian-800 bg-obsidian-900/90 backdrop-blur sticky top-0 z-30 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Brand and Context */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-lg shadow-sm">
            SN
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                SpendNest Revenue Intelligence
              </h1>
              <span className="px-2 py-0.5 rounded text-xs font-mono bg-obsidian-800 border border-obsidian-700 text-obsidian-300">
                v1.0-eval
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-obsidian-400 mt-0.5">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-obsidian-400" />
                21 August 2026
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-mono">
                <MapPin className="w-3.5 h-3.5 text-obsidian-400" />
                Asia/Kolkata
              </span>
              <span>•</span>
              <span className="text-emerald-400/90 font-medium">Selected Intake (44 Records)</span>
            </div>
          </div>
        </div>

        {/* Global Action Modals */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Manager Daily Brief Button */}
          <button
            onClick={onOpenBrief}
            className="px-3.5 py-1.5 rounded-md bg-obsidian-800 hover:bg-obsidian-700 border border-obsidian-700 text-xs font-medium text-white flex items-center gap-2 transition shadow-sm relative"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            Manager Daily Brief
            {discrepanciesCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/30">
                {discrepanciesCount} Alerts
              </span>
            )}
          </button>

          {/* Export & Manifest Hub */}
          <button
            onClick={onOpenExport}
            className="px-3.5 py-1.5 rounded-md bg-obsidian-800 hover:bg-obsidian-700 border border-obsidian-700 text-xs font-medium text-white flex items-center gap-2 transition shadow-sm"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
            Exports & Manifest
          </button>

          {/* Rubric & Decision Defense */}
          <button
            onClick={onOpenRubric}
            className="px-3.5 py-1.5 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-medium text-emerald-300 flex items-center gap-2 transition shadow-sm"
          >
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            Evaluator Defense & Findings
          </button>
        </div>

      </div>
    </header>
  );
};
