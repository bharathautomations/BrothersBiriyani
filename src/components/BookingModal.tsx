import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarCheck, Loader2, PartyPopper, X } from 'lucide-react';
import { useBookingModal } from '../hooks/useBookingModal';
import { createBooking } from '../lib/bookingApi';
import type { BookingRecord } from '../types/booking';
import DatePickerField from './DatePickerField';
import TimePickerField from './TimePickerField';
import {
  formatDisplayDate,
  formatDisplayTime,
  isTimeSlotBookable,
  isTodayOrFutureDate,
  isValidEmailAddress,
  isValidGuestCount,
  isValidPhoneNumber,
} from '../utils/bookingValidation';

interface FormState {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  bookingDate: string;
  bookingTime: string;
  numberOfGuests: string;
  specialRequest: string;
  website: string; // honeypot - must stay empty
}

const initialFormState: FormState = {
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  bookingDate: '',
  bookingTime: '',
  numberOfGuests: '',
  specialRequest: '',
  website: '',
};

const todayIso = () => new Date().toISOString().split('T')[0];

const BookingModal = () => {
  const { isOpen, closeBookingModal } = useBookingModal();
  const [form, setForm] = useState<FormState>(initialFormState);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);

  const idempotencyKeyRef = useRef<string>('');
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  const minDate = useMemo(() => todayIso(), []);

  // Reset the form and mint a fresh idempotency key every time the modal opens.
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
      idempotencyKeyRef.current = crypto.randomUUID();
      setForm(initialFormState);
      setFieldErrors({});
      setFormError(null);
      setStatus('idle');
      setConfirmedBooking(null);
      const focusTimer = window.setTimeout(() => firstFieldRef.current?.focus(), 50);
      return () => window.clearTimeout(focusTimer);
    }
    previouslyFocusedRef.current?.focus();
    return undefined;
  }, [isOpen]);

  // Escape closes the modal; Tab is trapped within it while open.
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        if (status !== 'submitting') closeBookingModal();
        return;
      }
      if (event.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, input, textarea, select, a[href]'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, status, closeBookingModal]);

  // Clear a previously chosen time if it falls within 1 hour of now after the date changes.
  useEffect(() => {
    if (form.bookingDate && form.bookingTime && !isTimeSlotBookable(form.bookingDate, form.bookingTime)) {
      setForm((prev) => ({ ...prev, bookingTime: '' }));
    }
  }, [form.bookingDate, form.bookingTime]);

  if (!isOpen) return null;

  const updateField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const errors: Partial<Record<keyof FormState, string>> = {};

    if (form.customerName.trim().length < 2) {
      errors.customerName = 'Please enter your full name.';
    }
    if (!isValidPhoneNumber(form.customerPhone)) {
      errors.customerPhone = 'Please enter a valid 10-digit Indian mobile number.';
    }
    if (form.customerEmail && !isValidEmailAddress(form.customerEmail)) {
      errors.customerEmail = 'Please enter a valid email address.';
    }
    if (!form.bookingDate || !isTodayOrFutureDate(form.bookingDate)) {
      errors.bookingDate = 'Please select today or a future date.';
    }
    if (!form.bookingTime) {
      errors.bookingTime = 'Please select a booking time.';
    } else if (!isTimeSlotBookable(form.bookingDate, form.bookingTime)) {
      errors.bookingTime = 'Please choose a time at least 1 hour from now.';
    }
    if (!isValidGuestCount(form.numberOfGuests)) {
      errors.numberOfGuests = 'Please enter a valid number of guests (1 or more).';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'submitting') return; // guards against double-click submissions
    setFormError(null);

    if (form.website.trim().length > 0) {
      // Honeypot triggered - silently drop the likely-bot submission.
      return;
    }

    if (!validate()) return;

    setStatus('submitting');

    const response = await createBooking({
      customerName: form.customerName.trim(),
      customerPhone: form.customerPhone.trim(),
      customerEmail: form.customerEmail.trim() || undefined,
      bookingDate: form.bookingDate,
      bookingTime: form.bookingTime,
      numberOfGuests: Number(form.numberOfGuests),
      specialRequest: form.specialRequest.trim() || undefined,
      idempotencyKey: idempotencyKeyRef.current,
      website: form.website,
    });

    if (response.success) {
      setConfirmedBooking(response.booking);
      setStatus('success');
    } else {
      setFormError(response.error);
      setStatus('idle');
    }
  };

  const handleClose = () => {
    if (status === 'submitting') return;
    closeBookingModal();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-modal-title"
            onClick={(event) => event.stopPropagation()}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-brand-charcoal rounded-2xl border border-brand-gold/20 shadow-2xl p-6 xs:p-7 sm:p-8"
          >
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-brand-gold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold rounded-full p-1"
              aria-label="Close booking form"
            >
              <X size={22} />
            </button>

            {status === 'success' && confirmedBooking ? (
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-brand-gold to-brand-orange mb-5">
                  <PartyPopper className="text-brand-charcoal-dark" size={30} />
                </div>
                <h2
                  id="booking-modal-title"
                  className="text-2xl xs:text-3xl font-bold font-display text-white mb-2"
                >
                  Table Booking Received
                </h2>
                <p className="text-gray-400 mb-6">
                  Thank you, {confirmedBooking.customerName.split(' ')[0]}! Here are your reservation
                  details.
                </p>

                <div className="text-left bg-brand-charcoal-dark rounded-xl border border-brand-gold/10 p-5 space-y-3 mb-6">
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-400">Name</span>
                    <span className="text-white font-semibold text-right">
                      {confirmedBooking.customerName}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-400">Date</span>
                    <span className="text-white font-semibold text-right">
                      {formatDisplayDate(confirmedBooking.bookingDate)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-400">Time</span>
                    <span className="text-white font-semibold text-right">
                      {formatDisplayTime(confirmedBooking.bookingTime)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-400">Guests</span>
                    <span className="text-white font-semibold text-right">
                      {confirmedBooking.numberOfGuests}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 border-t border-brand-gold/10 pt-3">
                    <span className="text-gray-400">Booking ID</span>
                    <span className="text-brand-gold font-bold text-right">
                      {confirmedBooking.bookingReference}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-400">Status</span>
                    <span className="text-brand-gold font-semibold text-right">
                      {confirmedBooking.status}
                    </span>
                  </div>
                </div>

                <p className="text-gray-300 italic mb-6">
                  We look forward to serving you at Brothers Biriyani!
                </p>

                <button type="button" onClick={handleClose} className="btn-primary w-full py-3">
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-gold to-brand-orange flex items-center justify-center flex-shrink-0">
                    <CalendarCheck className="text-brand-charcoal-dark" size={22} />
                  </div>
                  <div>
                    <h2
                      id="booking-modal-title"
                      className="text-xl xs:text-2xl font-bold font-display text-white"
                    >
                      Book a Table
                    </h2>
                    <p className="text-gray-400 text-sm">We&apos;ll confirm your reservation shortly.</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  {/* Honeypot field - hidden from real users, used only to catch basic bots. */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="website">Leave this field empty</label>
                    <input
                      id="website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.website}
                      onChange={(e) => updateField('website', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="bookingDate"
                        className="block text-sm font-medium text-gray-300 mb-1.5"
                      >
                        Date <span className="text-brand-red">*</span>
                      </label>
                      <DatePickerField
                        id="bookingDate"
                        value={form.bookingDate}
                        onChange={(next) => updateField('bookingDate', next)}
                        min={minDate}
                        hasError={!!fieldErrors.bookingDate}
                      />
                      {fieldErrors.bookingDate && (
                        <p className="text-brand-red text-xs mt-1">{fieldErrors.bookingDate}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="bookingTime"
                        className="block text-sm font-medium text-gray-300 mb-1.5"
                      >
                        Time <span className="text-brand-red">*</span>
                      </label>
                      <TimePickerField
                        id="bookingTime"
                        value={form.bookingTime}
                        onChange={(next) => updateField('bookingTime', next)}
                        hasError={!!fieldErrors.bookingTime}
                        selectedDate={form.bookingDate}
                      />
                      {fieldErrors.bookingTime && (
                        <p className="text-brand-red text-xs mt-1">{fieldErrors.bookingTime}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="numberOfGuests"
                      className="block text-sm font-medium text-gray-300 mb-1.5"
                    >
                      Number of Guests <span className="text-brand-red">*</span>
                    </label>
                    <input
                      id="numberOfGuests"
                      type="number"
                      min={1}
                      step={1}
                      inputMode="numeric"
                      placeholder="e.g. 4"
                      value={form.numberOfGuests}
                      onChange={(e) => updateField('numberOfGuests', e.target.value)}
                      className="w-full bg-brand-charcoal-dark border border-brand-gold/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
                      required
                    />
                    <p className="text-gray-500 text-xs mt-1">Any group size is welcome - no seating limit.</p>
                    {fieldErrors.numberOfGuests && (
                      <p className="text-brand-red text-xs mt-1">{fieldErrors.numberOfGuests}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="customerName"
                      className="block text-sm font-medium text-gray-300 mb-1.5"
                    >
                      Full Name <span className="text-brand-red">*</span>
                    </label>
                    <input
                      ref={firstFieldRef}
                      id="customerName"
                      type="text"
                      autoComplete="name"
                      placeholder="Your full name"
                      value={form.customerName}
                      onChange={(e) => updateField('customerName', e.target.value)}
                      className="w-full bg-brand-charcoal-dark border border-brand-gold/20 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                      required
                    />
                    {fieldErrors.customerName && (
                      <p className="text-brand-red text-xs mt-1">{fieldErrors.customerName}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="customerPhone"
                      className="block text-sm font-medium text-gray-300 mb-1.5"
                    >
                      Mobile Number <span className="text-brand-red">*</span>
                    </label>
                    <input
                      id="customerPhone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="98765 43210"
                      value={form.customerPhone}
                      onChange={(e) => updateField('customerPhone', e.target.value)}
                      className="w-full bg-brand-charcoal-dark border border-brand-gold/20 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                      required
                    />
                    <p className="text-gray-500 text-xs mt-1">10-digit Indian mobile number, with or without +91.</p>
                    {fieldErrors.customerPhone && (
                      <p className="text-brand-red text-xs mt-1">{fieldErrors.customerPhone}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="customerEmail"
                      className="block text-sm font-medium text-gray-300 mb-1.5"
                    >
                      Email <span className="text-gray-500">(optional)</span>
                    </label>
                    <input
                      id="customerEmail"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={form.customerEmail}
                      onChange={(e) => updateField('customerEmail', e.target.value)}
                      className="w-full bg-brand-charcoal-dark border border-brand-gold/20 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    />
                    {fieldErrors.customerEmail && (
                      <p className="text-brand-red text-xs mt-1">{fieldErrors.customerEmail}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="specialRequest"
                      className="block text-sm font-medium text-gray-300 mb-1.5"
                    >
                      Special Request <span className="text-gray-500">(optional)</span>
                    </label>
                    <textarea
                      id="specialRequest"
                      rows={3}
                      maxLength={500}
                      placeholder="Allergies, celebrations, seating preferences..."
                      value={form.specialRequest}
                      onChange={(e) => updateField('specialRequest', e.target.value)}
                      className="w-full bg-brand-charcoal-dark border border-brand-gold/20 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-gold resize-none"
                    />
                  </div>

                  {formError && (
                    <div className="bg-brand-red/10 border border-brand-red/30 text-brand-red text-sm rounded-lg px-4 py-3">
                      {formError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === 'submitting' && <Loader2 className="animate-spin" size={18} />}
                    {status === 'submitting' ? 'Booking your table...' : 'Confirm Booking'}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;
