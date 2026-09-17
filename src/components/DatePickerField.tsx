import { useEffect, useRef, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerFieldProps {
  id: string;
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  min?: string; // YYYY-MM-DD
  hasError?: boolean;
}

const WEEKDAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function parseIsoDate(value: string): Date | null {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDisplay(value: string): string {
  const date = parseIsoDate(value);
  if (!date) return '';
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

/**
 * A calendar picker rendered entirely within the page's own DOM (not the browser's
 * native OS-level overlay). Some environments - e.g. Zscaler Browser Isolation - fail
 * to render native <input type="date"> picker popups, so this keeps behavior consistent
 * for every visitor regardless of their browser/security software.
 */
const DatePickerField = ({ id, value, onChange, min, hasError }: DatePickerFieldProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => parseIsoDate(value) ?? parseIsoDate(min ?? '') ?? new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const minDate = min ? parseIsoDate(min) : null;
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const startWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [
    ...Array.from({ length: startWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];

  const isDisabled = (date: Date): boolean => {
    if (!minDate) return false;
    const minMidnight = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate()).getTime();
    return date.getTime() < minMidnight;
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        id={id}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between bg-brand-charcoal-dark border rounded-lg px-4 py-2.5 text-left focus:outline-none focus:ring-2 focus:ring-brand-gold ${
          hasError ? 'border-brand-red/60' : 'border-brand-gold/20'
        }`}
      >
        <span className={value ? 'text-white' : 'text-gray-600'}>
          {value ? formatDisplay(value) : 'Select a date'}
        </span>
        <Calendar size={18} className="text-brand-gold flex-shrink-0" />
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Choose a date"
          className="absolute z-20 mt-2 w-72 bg-brand-charcoal border border-brand-gold/20 rounded-xl shadow-2xl p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => setViewDate(new Date(year, month - 1, 1))}
              aria-label="Previous month"
              className="p-1.5 rounded-lg text-gray-400 hover:text-brand-gold hover:bg-brand-gold/10 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-white font-semibold text-sm">
              {viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button
              type="button"
              onClick={() => setViewDate(new Date(year, month + 1, 1))}
              aria-label="Next month"
              className="p-1.5 rounded-lg text-gray-400 hover:text-brand-gold hover:bg-brand-gold/10 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {WEEKDAY_LABELS.map((label) => (
              <div key={label} className="text-center text-xs text-gray-500 font-medium py-1">
                {label}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((date, index) => {
              if (!date) return <div key={`empty-${index}`} />;
              const iso = toIsoDate(date);
              const disabled = isDisabled(date);
              const selected = iso === value;
              return (
                <button
                  key={iso}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    onChange(iso);
                    setIsOpen(false);
                  }}
                  className={`h-9 rounded-lg text-sm font-medium transition-colors ${
                    selected
                      ? 'bg-gradient-to-r from-brand-gold to-brand-orange text-brand-charcoal-dark'
                      : disabled
                        ? 'text-gray-700 cursor-not-allowed'
                        : 'text-gray-300 hover:bg-brand-gold/10 hover:text-brand-gold'
                  }`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePickerField;
