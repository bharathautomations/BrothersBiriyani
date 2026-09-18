import { useEffect, useRef, useState } from 'react';
import { Clock } from 'lucide-react';
import { isTimeSlotBookable } from '../utils/bookingValidation';

interface TimePickerFieldProps {
  id: string;
  value: string; // HH:MM (24h)
  onChange: (value: string) => void;
  hasError?: boolean;
  /** YYYY-MM-DD - used to disable slots within 1 hour of now when this is today. */
  selectedDate: string;
}

interface TimeOption {
  value: string;
  label: string;
}

function formatTimeLabel(hour: number, minute: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${String(minute).padStart(2, '0')} ${period}`;
}

function buildTimeOptions(stepMinutes: number): TimeOption[] {
  const options: TimeOption[] = [];
  // The restaurant only accepts bookings between 10:00 AM and 10:00 PM.
  const startMinutes = 10 * 60;
  const endMinutes = 22 * 60;
  for (let totalMinutes = startMinutes; totalMinutes <= endMinutes; totalMinutes += stepMinutes) {
    const hour = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    options.push({
      value: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
      label: formatTimeLabel(hour, minute),
    });
  }
  return options;
}

const TIME_OPTIONS = buildTimeOptions(30);

/**
 * A time picker rendered entirely within the page's own DOM (not the browser's native
 * OS-level overlay), so it behaves identically for every visitor regardless of their
 * browser/security software (e.g. Zscaler Browser Isolation can fail to render native
 * <input type="time"> popups).
 */
const TimePickerField = ({ id, value, onChange, hasError, selectedDate }: TimePickerFieldProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (isOpen) {
      listRef.current?.querySelector('[data-selected="true"]')?.scrollIntoView({ block: 'center' });
    }
  }, [isOpen]);

  const selectedLabel = TIME_OPTIONS.find((option) => option.value === value)?.label;

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        id={id}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between bg-brand-charcoal-dark border rounded-lg px-4 py-2.5 text-left focus:outline-none focus:ring-2 focus:ring-brand-gold ${
          hasError ? 'border-brand-red/60' : 'border-brand-gold/20'
        }`}
      >
        <span className={value ? 'text-white' : 'text-gray-600'}>{selectedLabel ?? 'Select a time'}</span>
        <Clock size={18} className="text-brand-gold flex-shrink-0" />
      </button>

      {isOpen && (
        <div
          ref={listRef}
          role="listbox"
          aria-label="Choose a time"
          className="absolute z-20 mt-2 w-full max-h-64 overflow-y-auto bg-brand-charcoal border border-brand-gold/20 rounded-xl shadow-2xl py-2"
        >
          {TIME_OPTIONS.map((option) => {
            const selected = option.value === value;
            const disabled = !isTimeSlotBookable(selectedDate, option.value);
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected}
                aria-disabled={disabled}
                data-selected={selected}
                disabled={disabled}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  disabled
                    ? 'text-gray-700 cursor-not-allowed'
                    : selected
                      ? 'bg-brand-gold/20 text-brand-gold font-semibold'
                      : 'text-gray-300 hover:bg-brand-gold/10 hover:text-brand-gold'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TimePickerField;
