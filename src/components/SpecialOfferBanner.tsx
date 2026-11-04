import { motion } from 'framer-motion';
import { Sparkles, Users, CalendarCheck } from 'lucide-react';
import { useBookingModal } from '../hooks/useBookingModal';

const SpecialOfferBanner = () => {
  const { openBookingModal } = useBookingModal();

  return (
    <section className="py-12 xs:py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32 bg-brand-charcoal relative overflow-hidden">
      {/* Subtle decorative glow - matches the rest of the site instead of competing for attention */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-brand-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-brand-red/5 rounded-full blur-3xl" />

      <div className="max-w-[1600px] mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xs:gap-10 sm:gap-12 md:gap-14 lg:gap-16 xl:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-white text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-brand-gold/10 border border-brand-gold/30 rounded-full px-4 xs:px-5 sm:px-6 py-2 mb-4 xs:mb-5 sm:mb-6"
            >
              <Sparkles className="w-4 h-4 xs:w-5 xs:h-5 text-brand-gold" />
              <span className="font-semibold text-xs xs:text-sm tracking-wide text-brand-gold">SPECIAL OFFER</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-3xl xs:text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 xs:mb-4 leading-tight"
            >
              Bring the Whole{' '}
              <span className="relative inline-block">
                Family!
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="absolute bottom-2 left-0 right-0 h-3 bg-brand-gold/20 -z-10"
                />
              </span>
            </motion.h2>

            {/* Subheading */}
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold mb-4 xs:mb-5 sm:mb-6 text-brand-gold"
            >
              Family Biriyani Feast
            </motion.h3>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="text-xl md:text-2xl mb-8 text-gray-300 leading-relaxed"
            >
              "Perfectly packed for sharing, celebrating and creating memories."
            </motion.p>

            {/* Features List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4 mb-8"
            >
              {['Serves 6-8 People', 'Complete Feast', 'Best Value'].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center space-x-2 bg-brand-charcoal-dark border border-brand-gold/20 rounded-full px-4 py-2"
                >
                  <Users className="w-4 h-4 text-brand-gold" />
                  <span className="font-medium text-sm text-gray-300">{feature}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.button
              onClick={openBookingModal}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-3"
              aria-label="Book a table"
            >
              <span>Book a Table</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <CalendarCheck className="w-6 h-6" aria-hidden="true" />
              </motion.div>
            </motion.button>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative"
          >
            {/* Main Image */}
            <div className="relative z-10">
              <motion.div
                animate={{
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative"
              >
                <img
                  src="/images/ChickenBucketBiriyaniMega.jpeg"
                  alt="Family Biriyani Feast"
                  className="w-full h-auto rounded-3xl shadow-2xl"
                  loading="lazy"
                  decoding="async"
                />
                
                {/* Glowing Border Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-gold/30 to-brand-red/30 blur-2xl -z-10 scale-105" />
              </motion.div>

              {/* Floating Price Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1, type: "spring" }}
                className="absolute -top-6 -right-6 bg-brand-charcoal-dark text-white rounded-full p-6 shadow-2xl border-4 border-brand-gold/40"
              >
                <div className="text-center">
                  <div className="text-sm font-semibold text-brand-gold">Only</div>
                  <div className="text-3xl font-bold">₹1,800</div>
                </div>
              </motion.div>
            </div>

            {/* Background Decorative Circle */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-gold/5 rounded-full -z-10"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SpecialOfferBanner;
