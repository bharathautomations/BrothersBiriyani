import { motion } from 'framer-motion';
import { MousePointerClick, ClipboardList, Camera, UtensilsCrossed, Flame, CalendarCheck } from 'lucide-react';
import { useBookingModal } from '../hooks/useBookingModal';

const STEPS = [
  {
    icon: MousePointerClick,
    title: 'Click on Book a Table',
    description: 'Tap any "Book a Table" button on our site to open the booking form.',
  },
  {
    icon: ClipboardList,
    title: 'Enter Necessary Information',
    description: 'Fill in your name, phone number, date, time and number of guests.',
  },
  {
    icon: Camera,
    title: 'Take a Screenshot',
    description: 'Capture a screenshot or picture once your table is successfully booked.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Show It & Get Served',
    description: 'Show it at the restaurant and enjoy 20% off your Authentic Naati Style Biriyani.',
  },
];

// Deliberately louder/bolder treatment than SpecialOfferBanner above it - this is the priority offer.
const TableBookingOffer = () => {
  const { openBookingModal } = useBookingModal();

  return (
    <section className="py-14 xs:py-18 sm:py-24 md:py-28 lg:py-32 xl:py-36 relative overflow-hidden">
      {/* Bold animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-red via-brand-gold to-brand-orange" />
      <motion.div
        animate={{ opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 bg-gradient-to-tr from-brand-red/40 via-transparent to-brand-gold/40"
      />
      {/* Glowing spotlight frame - makes this section visually distinct from the banner above it */}
      <div className="absolute inset-3 xs:inset-5 sm:inset-6 border-2 border-white/40 rounded-[2rem] xs:rounded-[2.5rem] shadow-[0_0_80px_rgba(255,255,255,0.25)] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 xs:mb-14 sm:mb-16"
        >
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-flex items-center gap-2 bg-brand-charcoal-dark text-white font-bold px-6 xs:px-7 py-3 rounded-full shadow-2xl mb-6"
          >
            <Flame className="text-brand-gold" size={20} />
            <span className="text-xs xs:text-sm tracking-widest">OUR BIGGEST OFFER - BOOK NOW</span>
          </motion.div>
          <h2 className="text-white text-4xl xs:text-5xl sm:text-6xl md:text-6xl lg:text-7xl xl:text-8xl font-bold font-display mb-5 xs:mb-6 leading-tight">
            Book a Table &amp; Get
            <br />
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-white to-brand-cream px-2">
              20% OFF
            </span>
          </h2>
          <p className="text-lg xs:text-xl sm:text-2xl text-white/90 max-w-2xl mx-auto font-medium">
            Reserve your table and enjoy 20% off Authentic Naati Style Biriyani - just follow these simple steps.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xs:gap-7 sm:gap-8 mb-12 xs:mb-14">
          {STEPS.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12 }}
              className="group relative bg-white rounded-2xl p-6 xs:p-7 shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-brand-charcoal-dark flex items-center justify-center text-brand-gold font-bold text-base shadow-lg border-2 border-white">
                {index + 1}
              </div>
              <step.icon className="text-brand-red mb-4 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="text-brand-charcoal-dark font-bold mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.button
            onClick={openBookingModal}
            whileHover={{ scale: 1.08, y: -4 }}
            whileTap={{ scale: 0.95 }}
            animate={{ boxShadow: ['0 0 0px rgba(0,0,0,0.3)', '0 0 40px rgba(255,255,255,0.6)', '0 0 0px rgba(0,0,0,0.3)'] }}
            transition={{ boxShadow: { duration: 2, repeat: Infinity } }}
            className="bg-brand-charcoal-dark text-white text-lg xs:text-xl font-bold px-10 xs:px-12 py-4 xs:py-5 rounded-full inline-flex items-center gap-3"
            aria-label="Book a table and save 20%"
          >
            <CalendarCheck size={22} />
            Book a Table &amp; Save 20% Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default TableBookingOffer;
