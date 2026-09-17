import { createContext } from 'react';

export interface BookingModalContextValue {
  isOpen: boolean;
  openBookingModal: () => void;
  closeBookingModal: () => void;
}

export const BookingModalContext = createContext<BookingModalContextValue | undefined>(undefined);
