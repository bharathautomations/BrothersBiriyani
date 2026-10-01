import { CalendarCheck, CalendarClock, CheckCircle2, Clock3, Users, XCircle } from 'lucide-react';
import type { AdminSummary } from '../adminApi';

const SummaryCards = ({ summary }: { summary: AdminSummary | null }) => {
  const cards = [
    { label: "Today's Bookings", value: summary?.todaysBookings ?? '-', icon: CalendarCheck, color: 'from-brand-gold to-brand-orange' },
    { label: 'Upcoming Bookings', value: summary?.upcomingBookings ?? '-', icon: CalendarClock, color: 'from-brand-green to-brand-green-dark' },
    { label: "Today's Total Guests", value: summary?.todaysTotalGuests ?? '-', icon: Users, color: 'from-brand-red to-brand-orange' },
    { label: 'Confirmed', value: summary?.confirmedBookings ?? '-', icon: CheckCircle2, color: 'from-brand-green to-brand-green-dark' },
    { label: 'Pending', value: summary?.pendingBookings ?? '-', icon: Clock3, color: 'from-brand-gold to-brand-gold-light' },
    { label: 'Cancelled', value: summary?.cancelledBookings ?? '-', icon: XCircle, color: 'from-brand-red to-brand-red-dark' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 xs:gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-brand-charcoal rounded-xl border border-brand-gold/10 p-4 flex flex-col gap-2"
        >
          <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center`}>
            <card.icon className="text-brand-charcoal-dark" size={18} />
          </div>
          <div className="text-2xl font-bold text-white">{card.value}</div>
          <div className="text-xs text-gray-400 leading-tight">{card.label}</div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
