import { motion } from 'framer-motion';
import { Leaf, Award, Clock, Users, Shield, Sparkles } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      icon: Leaf,
      title: 'Fresh Ingredients',
      description: 'We source the finest, freshest ingredients daily for authentic taste',
      color: 'from-brand-green to-brand-green-dark',
    },
    {
      icon: Award,
      title: 'Award-Winning',
      description: 'Recognized as one of the best biriyani restaurants in the region',
      color: 'from-brand-gold to-brand-orange',
    },
    {
      icon: Clock,
      title: 'Fast Delivery',
      description: 'Hot and fresh meals delivered to your doorstep in 30 minutes',
      color: 'from-brand-orange to-brand-red',
    },
    {
      icon: Users,
      title: 'Family Recipes',
      description: 'Authentic recipes passed down through generations',
      color: 'from-brand-red to-brand-red-dark',
    },
    {
      icon: Shield,
      title: 'Quality Assured',
      description: 'Highest standards of hygiene and food safety maintained',
      color: 'from-brand-gold-light to-brand-gold',
    },
    {
      icon: Sparkles,
      title: 'Special Spices',
      description: 'Hand-blended spice mixes that create unforgettable flavors',
      color: 'from-brand-orange-dark to-brand-orange',
    },
  ];

  return (
    <section id="why-us" className="py-12 xs:py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32 bg-brand-charcoal-dark relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-red/5 rounded-full blur-3xl" />

      <div className="max-w-[1600px] mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 xs:mb-12 sm:mb-14 md:mb-16"
        >
          <div className="inline-block bg-brand-gold/10 border border-brand-gold/30 rounded-full px-4 xs:px-5 sm:px-6 py-2 mb-4 xs:mb-5 sm:mb-6">
            <span className="text-brand-gold font-semibold text-xs xs:text-sm sm:text-base">WHY CHOOSE US</span>
          </div>
          <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-display mb-3 xs:mb-4">
            What Makes Us <span className="text-gradient">Special</span>
          </h2>
          <p className="text-base xs:text-lg sm:text-xl md:text-xl text-gray-400 max-w-2xl mx-auto">
            Experience the perfect blend of tradition, quality, and exceptional
            service that sets us apart
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-6 xs:gap-7 sm:gap-8 md:gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-brand-charcoal rounded-2xl p-6 xs:p-7 sm:p-8 border border-brand-gold/20 hover:border-brand-gold/40 transition-all duration-300 hover:-translate-y-2"
            >
              {/* Icon */}
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform`}
              >
                <feature.icon className="text-white" size={28} />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-gold transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full blur-2xl" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-gray-300 text-lg mb-6">
            Ready to taste the difference?
          </p>
          <button className="btn-primary text-lg px-10 py-4">
            Order Your First Meal
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
