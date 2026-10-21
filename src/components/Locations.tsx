import { motion } from 'framer-motion';
import { MapPin, Phone, Navigation } from 'lucide-react';
import { branches, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL } from '../data/branches';

const Locations = () => {
  return (
    <section id="locations" className="py-12 xs:py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32 bg-brand-charcoal relative overflow-hidden">
      <div className="absolute top-20 left-0 w-72 h-72 bg-brand-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-0 w-72 h-72 bg-brand-red/10 rounded-full blur-3xl" />

      <div className="max-w-[1600px] mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 xs:mb-12 sm:mb-14 md:mb-16"
        >
          <div className="inline-block bg-brand-gold/10 border border-brand-gold/30 rounded-full px-4 xs:px-5 sm:px-6 py-2 mb-4 xs:mb-5 sm:mb-6">
            <span className="text-brand-gold font-semibold text-xs xs:text-sm sm:text-base">OUR LOCATIONS</span>
          </div>
          <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-display mb-3 xs:mb-4">
            Visit Us Across <span className="text-gradient">Bengaluru</span>
          </h2>
          <p className="text-base xs:text-lg sm:text-xl md:text-xl text-gray-400 max-w-2xl mx-auto">
            Three locations serving authentic Naati Style Biriyani near you
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xs:gap-7 sm:gap-8">
          {branches.map((branch, index) => (
            <motion.div
              key={branch.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="group relative bg-brand-charcoal-dark rounded-2xl p-6 xs:p-7 sm:p-8 border border-brand-gold/20 hover:border-brand-gold/40 transition-all duration-300 hover:-translate-y-2 flex flex-col"
            >
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-brand-gold transition-colors">
                {branch.name}
              </h3>
              <div className="flex items-start space-x-3 text-gray-400 mb-4 flex-1">
                <MapPin className="text-brand-gold flex-shrink-0 mt-1" size={18} />
                <span>{branch.address}</span>
              </div>
              <div className="flex items-start space-x-3 text-gray-400 mb-6">
                <Phone className="text-brand-gold flex-shrink-0 mt-1" size={18} />
                <a href={`tel:${CONTACT_PHONE_TEL}`} className="hover:text-brand-gold transition-colors">
                  {CONTACT_PHONE_DISPLAY}
                </a>
              </div>
              <a
                href={branch.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm py-2.5 px-6 inline-flex items-center justify-center gap-2 w-full"
                aria-label={`Get directions to ${branch.name} (opens in a new tab)`}
              >
                <Navigation size={16} />
                Get Directions
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Locations;
