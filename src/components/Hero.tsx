import { motion } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-brand-charcoal-dark pt-20"
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Golden circular shapes */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-96 h-96 bg-brand-gold/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-brand-red/15 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/4 w-64 h-64 bg-brand-green/10 rounded-full blur-3xl"
        />
        
        {/* Floating spice accents */}
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-40 right-1/4 w-3 h-3 bg-brand-red rounded-full opacity-40"
        />
        <motion.div
          animate={{
            rotate: [0, -360],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-40 left-1/3 w-2 h-2 bg-brand-orange rounded-full opacity-50"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-10 xs:py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 2xl:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xs:gap-10 sm:gap-12 md:gap-14 lg:gap-16 xl:gap-20 2xl:gap-24 items-center">
          
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-brand-red/20 to-brand-orange/20 border border-brand-gold/40 rounded-full px-4 xs:px-5 sm:px-6 py-2 xs:py-2.5 mb-4 xs:mb-5 sm:mb-6 lg:mb-8"
            >
              <Sparkles className="text-brand-gold" size={16} />
              <span className="text-brand-gold font-semibold text-xs xs:text-sm md:text-base tracking-wide">
                AUTHENTIC INDIAN FLAVOURS
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold font-display mb-4 xs:mb-5 sm:mb-6 leading-tight"
            >
              <span className="block text-white">A Taste of</span>
              <span className="block text-gradient glow-gold">Tradition</span>
              <span className="block text-white">in Every Bite</span>
            </motion.h1>

            {/* Supporting Text */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base xs:text-lg sm:text-xl md:text-xl lg:text-xl xl:text-2xl text-gray-300 mb-6 xs:mb-7 sm:mb-8 lg:mb-10 leading-relaxed max-w-2xl lg:max-w-xl xl:max-w-2xl"
            >
              Authentic, aromatic and unforgettable biriyani crafted with passion, 
              tradition and the finest ingredients.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 xs:gap-4"
            >
              <button className="btn-primary text-sm xs:text-base md:text-lg xl:text-xl px-6 xs:px-8 md:px-10 xl:px-12 py-2.5 xs:py-3 md:py-4 xl:py-5 w-full sm:w-auto" aria-label="Order food online now">
                Order Now
              </button>
              <a href="#menu" className="btn-secondary text-sm xs:text-base md:text-lg xl:text-xl px-6 xs:px-8 md:px-10 xl:px-12 py-2.5 xs:py-3 md:py-4 xl:py-5 w-full sm:w-auto inline-block text-center" aria-label="View our food menu">
                Explore Our Menu
              </a>
            </motion.div>
          </motion.div>

          {/* Right Side - Food Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mt-8 lg:mt-0"
          >
            {/* Main Food Image with Floating Animation */}
            <motion.div
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative z-10"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/images/ChickenBiriyaniWithKebab.jpeg"
                  alt="Delicious Brothers Biriyani"
                  className="w-full h-auto object-cover"
                  loading="eager"
                  fetchPriority="high"
                />
                {/* Glow overlay on image */}
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-gold/20 via-transparent to-brand-red/10 mix-blend-overlay" />
              </div>
            </motion.div>

            {/* Decorative Elements around Image */}
            
            {/* Golden glow - top right */}
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-10 -right-10 w-40 h-40 bg-brand-gold rounded-full blur-3xl opacity-40"
            />
            
            {/* Red spice accent - bottom left */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute -bottom-8 -left-8 w-32 h-32 bg-brand-red rounded-full blur-3xl opacity-50"
            />
            
            {/* Green herb accent - top left */}
            <motion.div
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
              className="absolute top-20 -left-10 w-24 h-24 bg-brand-green rounded-full blur-2xl opacity-40"
            />

            {/* Floating decorative circles */}
            <motion.div
              animate={{
                y: [0, -30, 0],
                x: [0, 20, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-10 right-10 w-16 h-16 border-4 border-brand-gold/30 rounded-full"
            />
            
            <motion.div
              animate={{
                y: [0, 40, 0],
                x: [0, -15, 0],
                rotate: [0, -180, -360],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute bottom-20 right-20 w-12 h-12 border-3 border-brand-orange/40 rounded-full"
            />

            {/* Steam effect suggestion (subtle lines) */}
            <motion.div
              animate={{
                y: [0, -100],
                opacity: [0.6, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeOut"
              }}
              className="absolute top-1/4 left-1/2 w-1 h-20 bg-gradient-to-t from-white/40 to-transparent blur-sm"
            />
            <motion.div
              animate={{
                y: [0, -100],
                opacity: [0.5, 0],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeOut",
                delay: 0.5
              }}
              className="absolute top-1/3 left-1/3 w-1 h-16 bg-gradient-to-t from-white/30 to-transparent blur-sm"
            />
          </motion.div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="text-brand-gold" size={32} />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
