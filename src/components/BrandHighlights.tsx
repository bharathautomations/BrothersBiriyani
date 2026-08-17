import { motion } from 'framer-motion';
import { Award, Leaf, Book, Heart } from 'lucide-react';

const BrandHighlights = () => {
  const highlights = [
    {
      icon: Award,
      text: '100% Authentic',
      color: 'from-brand-gold to-brand-orange',
      iconColor: 'text-brand-gold',
    },
    {
      icon: Leaf,
      text: 'Fresh Ingredients',
      color: 'from-brand-green to-brand-green-dark',
      iconColor: 'text-brand-green',
    },
    {
      icon: Book,
      text: 'Traditional Recipe',
      color: 'from-brand-orange to-brand-red',
      iconColor: 'text-brand-orange',
    },
    {
      icon: Heart,
      text: 'Made With Love',
      color: 'from-brand-red to-brand-red-dark',
      iconColor: 'text-brand-red',
    },
  ];

  return (
    <section className="relative py-6 xs:py-8 sm:py-10 md:py-12 lg:py-14 xl:py-16 bg-brand-charcoal border-y border-brand-gold/20 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-gold/5 via-transparent to-brand-red/5" />
      
      <div className="max-w-[1600px] mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 xs:gap-5 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12">
          {highlights.map((highlight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex flex-col items-center text-center group"
            >
              {/* Icon with gradient background */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
                className={`w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-16 md:h-16 lg:w-18 lg:h-18 xl:w-20 xl:h-20 rounded-2xl bg-gradient-to-br ${highlight.color} flex items-center justify-center mb-2 xs:mb-3 shadow-lg group-hover:shadow-xl transition-shadow`}
              >
                <highlight.icon className="text-white" size={20} />
              </motion.div>
              
              {/* Text */}
              <p className={`font-semibold text-xs xs:text-sm sm:text-base md:text-base lg:text-lg ${highlight.iconColor} tracking-wide`}>
                {highlight.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandHighlights;
