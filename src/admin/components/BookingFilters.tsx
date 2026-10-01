import { Search } from 'lucide-react';
import type { BookingListFilters, BookingStatus } from '../adminApi';

interface BookingFiltersProps {
  filters: BookingListFilters;
  onChange: (next: BookingListFilters) => void;
}

const DATE_VIEWS: { value: NonNullable<BookingListFilters['view']>; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'tomorrow', label: 'Tomorrow' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'custom', label: 'Custom Date' },
];

const STATUS_OPTIONS: (BookingStatus | '')[] = ['', 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'REJECTED'];

const BookingFilters = ({ filters, onChange }: BookingFiltersProps) => {
  return (
    <div className="bg-brand-charcoal rounded-xl border border-brand-gold/10 p-4 space-y-4">
      {/* Date view tabs */}
      <div className="flex flex-wrap gap-2">
        {DATE_VIEWS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange({ ...filters, view: option.value, page: 1 })}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filters.view === option.value
                ? 'bg-gradient-to-r from-brand-gold to-brand-orange text-brand-charcoal-dark'
                : 'bg-brand-charcoal-dark text-gray-300 hover:text-brand-gold border border-brand-gold/10'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {filters.view === 'custom' && (
        <input
          type="date"
          value={filters.date ?? ''}
          onChange={(e) => onChange({ ...filters, date: e.target.value, page: 1 })}
          className="bg-brand-charcoal-dark border border-brand-gold/20 rounded-lg px-4 py-2 text-white [color-scheme:dark]"
        />
      )}

      {/* Search + time + status + sort */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Customer name"
            value={filters.customerName ?? ''}
            onChange={(e) => onChange({ ...filters, customerName: e.target.value, page: 1 })}
            className="w-full bg-brand-charcoal-dark border border-brand-gold/20 rounded-lg pl-9 pr-3 py-2 text-white placeholder:text-gray-600 text-sm"
          />
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Phone number"
            value={filters.phone ?? ''}
            onChange={(e) => onChange({ ...filters, phone: e.target.value, page: 1 })}
            className="w-full bg-brand-charcoal-dark border border-brand-gold/20 rounded-lg pl-9 pr-3 py-2 text-white placeholder:text-gray-600 text-sm"
          />
        </div>
        <input
          type="time"
          value={filters.time ?? ''}
          onChange={(e) => onChange({ ...filters, time: e.target.value, page: 1 })}
          className="bg-brand-charcoal-dark border border-brand-gold/20 rounded-lg px-3 py-2 text-white text-sm [color-scheme:dark]"
          aria-label="Filter by time"
        />
        <select
          value={filters.status ?? ''}
          onChange={(e) => onChange({ ...filters, status: e.target.value as BookingStatus | '', page: 1 })}
          className="bg-brand-charcoal-dark border border-brand-gold/20 rounded-lg px-3 py-2 text-white text-sm"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option || 'all'} value={option}>
              {option || 'All statuses'}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <select
            value={filters.sortBy ?? 'date'}
            onChange={(e) => onChange({ ...filters, sortBy: e.target.value as BookingListFilters['sortBy'] })}
            className="flex-1 bg-brand-charcoal-dark border border-brand-gold/20 rounded-lg px-3 py-2 text-white text-sm"
          >
            <option value="date">Sort: Date</option>
            <option value="time">Sort: Time</option>
            <option value="guests">Sort: Guests</option>
            <option value="created">Sort: Created</option>
          </select>
          <button
            type="button"
            onClick={() => onChange({ ...filters, sortDir: filters.sortDir === 'desc' ? 'asc' : 'desc' })}
            className="px-3 py-2 rounded-lg bg-brand-charcoal-dark border border-brand-gold/20 text-gray-300 text-sm hover:text-brand-gold"
            aria-label="Toggle sort direction"
          >
            {filters.sortDir === 'desc' ? '↓' : '↑'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingFilters;
