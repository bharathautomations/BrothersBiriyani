import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { BookingModalContext } from './BookingModalContext';

export const BookingModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openBookingModal = useCallback(() => setIsOpen(true), []);
  const closeBookingModal = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, openBookingModal, closeBookingModal }),
    [isOpen, openBookingModal, closeBookingModal]
  );

  return <BookingModalContext.Provider value={value}>{children}</BookingModalContext.Provider>;
};
