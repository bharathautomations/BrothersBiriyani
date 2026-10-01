import { formatDisplayDate, formatDisplayTime } from '../../utils/bookingValidation';
import type { AdminBookingRecord } from '../adminApi';

interface BookingListProps {
  bookings: AdminBookingRecord[];
  isLoading: boolean;
  onSelect: (booking: AdminBookingRecord) => void;
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-brand-gold/15 text-brand-gold',
  CONFIRMED: 'bg-brand-green/15 text-brand-green',
  CANCELLED: 'bg-brand-red/15 text-brand-red',
  REJECTED: 'bg-brand-red/15 text-brand-red',
  COMPLETED: 'bg-gray-500/15 text-gray-300',
};

function groupByDate(bookings: AdminBookingRecord[]): { date: string; bookings: AdminBookingRecord[]; totalGuests: number }[] {
  const groups = new Map<string, AdminBookingRecord[]>();
  for (const booking of bookings) {
    const existing = groups.get(booking.bookingDate) ?? [];
    existing.push(booking);
    groups.set(booking.bookingDate, existing);
  }
  return Array.from(groups.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, groupBookings]) => ({
      date,
      bookings: groupBookings,
      // Informational only - never compared against any capacity/limit.
      totalGuests: groupBookings
        .filter((b) => b.status !== 'CANCELLED' && b.status !== 'REJECTED')
        .reduce((sum, b) => sum + b.numberOfGuests, 0),
    }));
}

const BookingList = ({ bookings, isLoading, onSelect }: BookingListProps) => {
  if (isLoading) {
    return <div className="text-center py-12 text-gray-400">Loading bookings...</div>;
  }

  if (bookings.length === 0) {
    return <div className="text-center py-12 text-gray-400">No bookings found for this view.</div>;
  }

  const groups = groupByDate(bookings);

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <div key={group.date}>
          <div className="flex items-baseline justify-between mb-3 px-1">
            <h3 className="text-lg font-bold text-white">{formatDisplayDate(group.date)}</h3>
            <span className="text-sm text-gray-400">
              Total expected guests: <span className="text-brand-gold font-semibold">{group.totalGuests}</span>
            </span>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-brand-gold/10">
            <table className="w-full text-sm">
              <thead className="bg-brand-charcoal-dark text-gray-400">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Booking ID</th>
                  <th className="text-left px-4 py-3 font-medium">Customer</th>
                  <th className="text-left px-4 py-3 font-medium">Phone</th>
                  <th className="text-left px-4 py-3 font-medium">Time</th>
                  <th className="text-left px-4 py-3 font-medium">Guests</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {group.bookings.map((booking) => (
                  <tr
                    key={booking.id}
                    onClick={() => onSelect(booking)}
                    className="border-t border-brand-gold/10 hover:bg-brand-charcoal-dark cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 text-brand-gold font-semibold">{booking.bookingReference}</td>
                    <td className="px-4 py-3 text-white">{booking.customerName}</td>
                    <td className="px-4 py-3 text-gray-300">{booking.customerPhone}</td>
                    <td className="px-4 py-3 text-gray-300">{formatDisplayTime(booking.bookingTime)}</td>
                    <td className="px-4 py-3 text-gray-300">{booking.numberOfGuests}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[booking.status]}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(booking.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {group.bookings.map((booking) => (
              <button
                key={booking.id}
                type="button"
                onClick={() => onSelect(booking)}
                className="w-full text-left bg-brand-charcoal-dark rounded-xl border border-brand-gold/10 p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-brand-gold font-semibold text-sm">{booking.bookingReference}</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[booking.status]}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="text-white font-medium">{booking.customerName}</div>
                <div className="text-gray-400 text-sm">{booking.customerPhone}</div>
                <div className="flex justify-between mt-2 text-sm text-gray-300">
                  <span>{formatDisplayTime(booking.bookingTime)}</span>
                  <span>{booking.numberOfGuests} guests</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingList;
