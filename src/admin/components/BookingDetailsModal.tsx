import { useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { formatDisplayDate, formatDisplayTime } from '../../utils/bookingValidation';
import { updateBookingStatus, type AdminBookingRecord, type BookingStatus } from '../adminApi';

interface BookingDetailsModalProps {
  booking: AdminBookingRecord;
  onClose: () => void;
  onUpdated: (booking: AdminBookingRecord) => void;
}

const ACTIONS: { status: BookingStatus; label: string; className: string }[] = [
  { status: 'CONFIRMED', label: 'Confirm', className: 'bg-brand-green hover:bg-brand-green-dark' },
  { status: 'COMPLETED', label: 'Mark Completed', className: 'bg-gray-500 hover:bg-gray-600' },
  { status: 'CANCELLED', label: 'Cancel', className: 'bg-brand-orange hover:bg-brand-orange-dark' },
  { status: 'REJECTED', label: 'Reject', className: 'bg-brand-red hover:bg-brand-red-dark' },
];

const WHATSAPP_STATUS_COLOR: Record<string, string> = {
  SENT: 'text-brand-green',
  FAILED: 'text-brand-red',
  PENDING: 'text-gray-400',
};

const BookingDetailsModal = ({ booking, onClose, onUpdated }: BookingDetailsModalProps) => {
  const [pendingStatus, setPendingStatus] = useState<BookingStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async (status: BookingStatus) => {
    if (pendingStatus) return;
    setPendingStatus(status);
    setError(null);

    const result = await updateBookingStatus(booking.bookingReference, status);

    if (result.success && result.booking) {
      onUpdated(result.booking);
    } else {
      setError(result.error ?? 'Unable to update booking status.');
    }
    setPendingStatus(null);
  };

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-brand-charcoal rounded-2xl border border-brand-gold/20 shadow-2xl p-6"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-brand-gold"
          aria-label="Close"
        >
          <X size={22} />
        </button>

        <h2 className="text-xl font-bold text-white mb-1">{booking.bookingReference}</h2>
        <p className="text-gray-400 text-sm mb-6">Booking Details</p>

        <dl className="space-y-3 text-sm mb-6">
          <Row label="Customer Name" value={booking.customerName} />
          <Row label="Phone" value={booking.customerPhone} />
          <Row label="Email" value={booking.customerEmail ?? '-'} />
          <Row label="Date" value={formatDisplayDate(booking.bookingDate)} />
          <Row label="Time" value={formatDisplayTime(booking.bookingTime)} />
          <Row label="Number of Guests" value={String(booking.numberOfGuests)} />
          <Row label="Special Request" value={booking.specialRequest ?? 'None'} />
          <Row label="Status" value={booking.status} />
          <Row label="Created At" value={new Date(booking.createdAt).toLocaleString('en-US')} />
          <Row label="Updated At" value={new Date(booking.updatedAt).toLocaleString('en-US')} />
        </dl>

        <div className="bg-brand-charcoal-dark rounded-xl border border-brand-gold/10 p-4 mb-6">
          <h3 className="text-white font-semibold text-sm mb-3">WhatsApp Notification Status</h3>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Restaurant WhatsApp</span>
            <span className={`font-semibold ${WHATSAPP_STATUS_COLOR[booking.restaurantWhatsappStatus]}`}>
              {booking.restaurantWhatsappStatus}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Customer WhatsApp</span>
            <span className={`font-semibold ${WHATSAPP_STATUS_COLOR[booking.customerWhatsappStatus]}`}>
              {booking.customerWhatsappStatus}
            </span>
          </div>
          {booking.whatsappLastError && (
            <p className="text-brand-red text-xs mt-2 break-words">{booking.whatsappLastError}</p>
          )}
        </div>

        {error && (
          <div className="bg-brand-red/10 border border-brand-red/30 text-brand-red text-sm rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {ACTIONS.map((action) => (
            <button
              key={action.status}
              type="button"
              disabled={pendingStatus !== null || booking.status === action.status}
              onClick={() => handleAction(action.status)}
              className={`${action.className} text-white font-semibold py-2.5 rounded-lg text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
            >
              {pendingStatus === action.status && <Loader2 className="animate-spin" size={14} />}
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between gap-4">
    <dt className="text-gray-400">{label}</dt>
    <dd className="text-white text-right break-words">{value}</dd>
  </div>
);

export default BookingDetailsModal;
