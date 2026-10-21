import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { branches } from '../data/branches';

const Testimonials = () => {
  return (
    <section className="py-12 xs:py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32 bg-brand-charcoal-dark relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-20 left-0 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-brand-green/10 rounded-full blur-3xl" />

      <div className="max-w-[1600px] mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 xs:mb-12 sm:mb-14 md:mb-16"
        >
          <div className="inline-block bg-brand-gold/10 border border-brand-gold/30 rounded-full px-4 xs:px-5 sm:px-6 py-2 mb-4 xs:mb-5 sm:mb-6">
            <span className="text-brand-gold font-semibold text-xs xs:text-sm sm:text-base">TESTIMONIALS</span>
          </div>
          <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-display mb-3 xs:mb-4">
            What Our <span className="text-gradient">Customers Say</span>
          </h2>
          <p className="text-base xs:text-lg sm:text-xl md:text-xl text-gray-400 max-w-2xl mx-auto">
            Don't just take our word for it—hear from our satisfied customers
          </p>
        </motion.div>

        {/* Google Reviews placeholder - real reviews will be pulled in here later */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center bg-brand-charcoal rounded-2xl p-8 xs:p-10 sm:p-12 border border-brand-gold/20"
        >
          <div className="flex items-center justify-center space-x-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={24} className="fill-brand-gold text-brand-gold" />
            ))}
          </div>
          <p className="text-gray-300 text-lg mb-6">
            Customer reviews are coming soon. In the meantime, check out what people are saying
            about us on Google at any of our locations.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {branches.map((branch) => (
              <a
                key={branch.id}
                href={branch.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm py-2.5 px-5"
                aria-label={`Read Google reviews for ${branch.name} (opens in a new tab)`}
              >
                {branch.name} Reviews
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;

