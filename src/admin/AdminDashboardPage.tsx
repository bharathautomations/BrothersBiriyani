import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, UtensilsCrossed } from 'lucide-react';
import {
  adminLogout,
  fetchAdminBookings,
  fetchAdminSummary,
  type AdminBookingRecord,
  type AdminSummary,
  type BookingListFilters,
} from './adminApi';
import SummaryCards from './components/SummaryCards';
import BookingFilters from './components/BookingFilters';
import BookingList from './components/BookingList';
import BookingDetailsModal from './components/BookingDetailsModal';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [bookings, setBookings] = useState<AdminBookingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<BookingListFilters>({
    view: 'today',
    sortBy: 'time',
    sortDir: 'asc',
    page: 1,
    limit: 100,
  });
  const [selectedBooking, setSelectedBooking] = useState<AdminBookingRecord | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const [summaryResult, bookingsResult] = await Promise.all([fetchAdminSummary(), fetchAdminBookings(filters)]);
    setSummary(summaryResult);
    setBookings(bookingsResult?.bookings ?? []);
    setIsLoading(false);
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleLogout = async () => {
    await adminLogout();
    navigate('/admin/login', { replace: true });
  };

  const handleBookingUpdated = (updated: AdminBookingRecord) => {
    setBookings((prev) => prev.map((booking) => (booking.id === updated.id ? updated : booking)));
    setSelectedBooking(updated);
    fetchAdminSummary().then(setSummary);
  };

  return (
    <div className="min-h-screen bg-brand-charcoal-dark">
      <header className="bg-brand-charcoal border-b border-brand-gold/10 px-4 xs:px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-gold to-brand-orange flex items-center justify-center">
            <UtensilsCrossed className="text-brand-charcoal-dark" size={18} />
          </div>
          <div>
            <h1 className="text-white font-bold text-sm xs:text-base">Brothers Biriyani</h1>
            <p className="text-gray-400 text-xs">Booking Admin Dashboard</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-300 hover:text-brand-gold text-sm font-medium"
        >
          <LogOut size={16} />
          <span className="hidden xs:inline">Logout</span>
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-4 xs:px-6 py-6 space-y-6">
        <SummaryCards summary={summary} />
        <BookingFilters filters={filters} onChange={setFilters} />
        <BookingList bookings={bookings} isLoading={isLoading} onSelect={setSelectedBooking} />
      </main>

      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdated={handleBookingUpdated}
        />
      )}
    </div>
  );
};

export default AdminDashboardPage;
