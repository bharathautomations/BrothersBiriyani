import { motion } from 'framer-motion';
import { ArrowRight, Utensils } from 'lucide-react';

const FinalCTA = () => {
  return (
    <section className="relative py-16 xs:py-20 sm:py-24 md:py-28 lg:py-32 xl:py-40 overflow-hidden">
      {/* Dark Background */}
      <div className="absolute inset-0 bg-brand-charcoal-dark" />

      {/* Subtle Food Background Images */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute top-0 left-0 w-1/2 h-full bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/ChickenDumBiriyani.jpeg')",
            backgroundBlendMode: 'luminosity',
          }}
        />
        <div 
          className="absolute top-0 right-0 w-1/2 h-full bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/MuttonBiriyani.jpeg')",
            backgroundBlendMode: 'luminosity',
          }}
        />
      </div>

      {/* Gradient Overlay for Depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-charcoal-dark via-transparent to-brand-charcoal-dark" />

      {/* Animated Accent Glows */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 left-20 w-96 h-96 bg-brand-gold/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-20 right-20 w-96 h-96 bg-brand-red/20 rounded-full blur-3xl"
      />

      {/* Content Container */}
      <div className="max-w-[1400px] mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        <div className="text-center">
          {/* Icon Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", duration: 0.8 }}
            className="inline-flex items-center justify-center mb-6 xs:mb-7 sm:mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-gold to-brand-red rounded-full blur-xl opacity-50" />
              <div className="relative bg-gradient-to-br from-brand-gold to-brand-red p-3 xs:p-4 rounded-full">
                <Utensils className="w-8 h-8 xs:w-10 xs:h-10 text-brand-charcoal-dark" />
              </div>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 xs:mb-5 sm:mb-6 leading-tight"
          >
            Ready for Some{' '}
            <span className="relative inline-block">
              <span className="text-gradient">Serious Biriyani?</span>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-brand-gold via-brand-orange to-brand-red rounded-full"
              />
            </span>
          </motion.h2>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg xs:text-xl sm:text-2xl md:text-3xl text-gray-300 mb-8 xs:mb-10 sm:mb-12 font-light"
          >
            "Your next unforgettable meal is just one order away."
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 xs:gap-5 sm:gap-6"
          >
            {/* Primary Button - Order Now */}
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="group relative overflow-hidden bg-gradient-to-r from-brand-gold via-brand-orange to-brand-red text-brand-charcoal-dark px-8 xs:px-10 py-4 xs:py-5 rounded-full text-lg xs:text-xl font-bold shadow-2xl min-w-[200px] xs:min-w-[240px] w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-brand-charcoal-dark"
              aria-label="Order biriyani online now"
            >
              <motion.div
                className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"
                whileHover={{ opacity: 0.2 }}
              />
              <span className="relative flex items-center justify-center space-x-3">
                <span>Order Now</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <ArrowRight className="w-6 h-6" aria-hidden="true" />
                </motion.div>
              </span>
              
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-gold to-brand-red blur-xl scale-110" />
              </div>
            </motion.button>

            {/* Secondary Button - View Menu */}
            <motion.a
              href="#menu"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="group relative border-2 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-charcoal-dark px-8 xs:px-10 py-4 xs:py-5 rounded-full text-lg xs:text-xl font-bold transition-all duration-300 min-w-[200px] xs:min-w-[240px] w-full sm:w-auto text-center focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-brand-charcoal-dark"
              aria-label="View our food menu"
            >
              <span className="relative flex items-center justify-center">
                View Menu
              </span>
              
              {/* Border glow on hover */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-brand-gold opacity-0 group-hover:opacity-100 blur-md scale-110"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
            </motion.a>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-gray-400"
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-brand-gold rounded-full animate-pulse" />
              <span className="text-sm font-medium">Fresh Daily</span>
            </div>
            <div className="w-px h-6 bg-gray-700" />
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-brand-red rounded-full animate-pulse" />
              <span className="text-sm font-medium">30 Min Delivery</span>
            </div>
            <div className="w-px h-6 bg-gray-700" />
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-brand-green rounded-full animate-pulse" />
              <span className="text-sm font-medium">100% Authentic</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Decorative Wave */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/20 to-transparent" />
    </section>
  );
};

export default FinalCTA;
