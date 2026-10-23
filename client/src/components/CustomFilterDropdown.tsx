import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownOption<T extends string = string> {
  value: T;
  label: string;
  badge?: string | number;
  dotColor?: string;
  glow?: string;
  theme?: {
    bg: string;
    text: string;
    border: string;
  };
  group?: string;
}

interface CustomFilterDropdownProps<T extends string = string> {
  value: T;
  onChange: (value: T) => void;
  options: DropdownOption<T>[];
  placeholder: string;
  icon?: React.ReactNode;
  selectAriaLabel?: string;
}

export function CustomFilterDropdown<T extends string = string>({
  value,
  onChange,
  options,
  placeholder,
  icon,
  selectAriaLabel
}: CustomFilterDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);
  const isCustomSelected = value !== 'all' && selectedOption;

  // Close on click outside
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

  // Close on Escape key
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

  const handleSelect = (val: T) => {
    onChange(val);
    setIsOpen(false);
  };

  // Group options if any option specifies a group
  const hasGroups = options.some((o) => !!o.group);
  const groups: Record<string, DropdownOption<T>[]> = {};
  if (hasGroups) {
    options.forEach((opt) => {
      const g = opt.group || 'Default';
      if (!groups[g]) groups[g] = [];
      groups[g].push(opt);
    });
  }

  // Active trigger styling
  const triggerStyle = isCustomSelected && selectedOption?.theme
    ? `${selectedOption.theme.bg} ${selectedOption.theme.text} ${selectedOption.theme.border}`
    : isCustomSelected
    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
    : 'bg-dark-900 hover:bg-dark-850 text-dark-200 border-white/[0.08] hover:border-white/[0.14]';

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      
      {/* Hidden Native Select for Screen Readers and Automated Test Compatibility */}
      <select
        aria-label={selectAriaLabel || placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="sr-only"
        tabIndex={-1}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Styled Interactive Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all duration-150 shadow-sm cursor-pointer ${triggerStyle} focus:outline-none focus:ring-1 focus:ring-white/20`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {isCustomSelected && selectedOption?.dotColor ? (
          <span className={`w-1.5 h-1.5 rounded-full ${selectedOption.dotColor} ${selectedOption.glow || ''}`} />
        ) : (
          icon && <span className="opacity-80">{icon}</span>
        )}

        <span className="tracking-tight max-w-[150px] truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        {isCustomSelected && selectedOption?.badge !== undefined && (
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-white/[0.08] text-white/90 font-mono">
            {selectedOption.badge}
          </span>
        )}

        <ChevronDown
          className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${
            isOpen ? 'rotate-180 opacity-100' : ''
          }`}
        />
      </button>

      {/* Luxury Floating Popover Menu */}
      {isOpen && (
        <div
          className="absolute left-0 top-full mt-1.5 min-w-[220px] max-w-[300px] rounded-xl bg-dark-900 border border-white/[0.12] shadow-2xl p-1.5 z-50 backdrop-blur-xl animate-in fade-in-0 zoom-in-95 duration-150 max-h-[340px] overflow-y-auto custom-scrollbar"
          role="menu"
        >
          {hasGroups ? (
            Object.entries(groups).map(([groupName, groupOpts]) => (
              <div key={groupName} className="mb-2 last:mb-0">
                {groupName !== 'Default' && (
                  <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-dark-400 font-bold border-b border-white/[0.04] mb-1">
                    {groupName}
                  </div>
                )}
                <div className="space-y-0.5">
                  {groupOpts.map((opt) => renderOptionItem(opt, value, handleSelect))}
                </div>
              </div>
            ))
          ) : (
            <div className="space-y-0.5">
              {options.map((opt) => renderOptionItem(opt, value, handleSelect))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}

function renderOptionItem<T extends string>(
  opt: DropdownOption<T>,
  currentVal: T,
  onSelect: (val: T) => void
) {
  const isSelected = opt.value === currentVal;

  return (
    <button
      key={opt.value}
      type="button"
      onClick={() => onSelect(opt.value)}
      className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs font-medium transition cursor-pointer ${
        isSelected
          ? 'bg-dark-800 text-white font-semibold'
          : 'text-dark-300 hover:text-white hover:bg-dark-800/60'
      }`}
      role="menuitem"
    >
      <div className="flex items-center gap-2 truncate">
        {opt.dotColor ? (
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${opt.dotColor} ${opt.glow || ''}`} />
        ) : (
          <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-transparent" />
        )}
        <span className="truncate">{opt.label}</span>
      </div>

      <div className="flex items-center gap-1.5 shrink-0 ml-2">
        {opt.badge !== undefined && (
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-dark-800 border border-white/[0.06] text-dark-400 font-mono">
            {opt.badge}
          </span>
        )}
        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
      </div>
    </button>
  );
}
