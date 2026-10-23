import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { ReviewState } from '../types/index.js';

interface ReviewStateDropdownProps {
  value: ReviewState;
  onChange: (newState: ReviewState) => void;
  isLastFewRows?: boolean;
}

interface StatusConfig {
  value: ReviewState;
  label: string;
  dotColor: string;
  glow?: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  hoverBg: string;
  icon: React.ReactNode;
}

const STATUS_CONFIGS: Record<ReviewState, StatusConfig> = {
  unreviewed: {
    value: 'unreviewed',
    label: 'Pending',
    dotColor: 'bg-amber-400',
    badgeBg: 'bg-dark-850',
    badgeText: 'text-dark-200',
    badgeBorder: 'border-white/[0.08]',
    hoverBg: 'hover:bg-dark-800 hover:border-white/[0.15] hover:text-white',
    icon: <Clock className="w-3.5 h-3.5 text-amber-400" />
  },
  reviewed: {
    value: 'reviewed',
    label: 'Reviewed',
    dotColor: 'bg-emerald-400',
    glow: 'shadow-[0_0_8px_rgba(52,211,153,0.5)]',
    badgeBg: 'bg-emerald-500/10',
    badgeText: 'text-emerald-300',
    badgeBorder: 'border-emerald-500/25',
    hoverBg: 'hover:bg-emerald-500/20 hover:border-emerald-500/40',
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
  },
  'pending_re-review': {
    value: 'pending_re-review',
    label: 'Needs Re-review',
    dotColor: 'bg-rose-400',
    glow: 'shadow-[0_0_8px_rgba(251,113,133,0.5)]',
    badgeBg: 'bg-rose-500/10',
    badgeText: 'text-rose-300',
    badgeBorder: 'border-rose-500/25',
    hoverBg: 'hover:bg-rose-500/20 hover:border-rose-500/40',
    icon: <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
  }
};

const OPTIONS: ReviewState[] = ['unreviewed', 'reviewed', 'pending_re-review'];

export const ReviewStateDropdown: React.FC<ReviewStateDropdownProps> = ({
  value,
  onChange,
  isLastFewRows = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const current = STATUS_CONFIGS[value] || STATUS_CONFIGS.unreviewed;

  // Handle outside click to close popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (newState: ReviewState, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(newState);
    setIsOpen(false);
  };

  return (
    <div 
      ref={containerRef} 
      className="relative inline-block text-left"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-2 transition-all duration-150 shadow-sm ${current.badgeBg} ${current.badgeText} ${current.badgeBorder} ${current.hoverBg} focus:outline-none focus:ring-1 focus:ring-white/20`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span 
          className={`w-1.5 h-1.5 rounded-full ${current.dotColor} ${current.glow || ''}`} 
        />
        <span className="tracking-tight">{current.label}</span>
        <ChevronDown 
          className={`w-3 h-3 text-dark-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-white' : ''
          }`} 
        />
      </button>

      {/* Floating Popover Menu */}
      {isOpen && (
        <div
          className={`absolute right-0 ${
            isLastFewRows ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
          } w-48 rounded-xl bg-dark-900/95 border border-white/[0.12] shadow-2xl p-1.5 z-50 backdrop-blur-xl animate-in fade-in-0 zoom-in-95 duration-150`}
          role="menu"
        >
          <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-dark-400 border-b border-white/[0.05] mb-1">
            Change Review State
          </div>

          <div className="space-y-0.5">
            {OPTIONS.map((optKey) => {
              const opt = STATUS_CONFIGS[optKey];
              const isSelected = optKey === value;

              return (
                <button
                  key={optKey}
                  type="button"
                  onClick={(e) => handleSelect(optKey, e)}
                  className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs font-medium transition ${
                    isSelected
                      ? 'bg-dark-800 text-white'
                      : 'text-dark-300 hover:text-white hover:bg-dark-800/60'
                  }`}
                  role="menuitem"
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${opt.dotColor} ${opt.glow || ''}`} />
                    <span>{opt.label}</span>
                  </div>

                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
