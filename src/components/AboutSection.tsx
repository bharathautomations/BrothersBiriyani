import { motion } from 'framer-motion';
import { Users, Heart, Award, Clock } from 'lucide-react';

const AboutSection = () => {
  const stats = [
    { icon: Users, value: '50K+', label: 'Happy Customers' },
    { icon: Heart, value: '100+', label: 'Dishes Served Daily' },
    { icon: Award, value: '15+', label: 'Years Experience' },
    { icon: Clock, value: '30min', label: 'Average Delivery' },
  ];

  return (
    <section id="about" className="py-12 xs:py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32 bg-brand-charcoal relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-20 right-0 w-72 h-72 bg-brand-orange/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-72 h-72 bg-brand-green/10 rounded-full blur-3xl" />

      <div className="max-w-[1600px] mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xs:gap-10 sm:gap-12 md:gap-14 lg:gap-16 xl:gap-20 items-center">
          {/* Left - Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-3 xs:gap-4 sm:gap-4">
              <img
                src="/images/ChickenDumBiriyani.jpeg"
                alt="Authentic Brothers Biriyani dish with rice and spices"
                className="rounded-2xl shadow-2xl w-full h-48 xs:h-56 sm:h-60 md:h-64 lg:h-72 xl:h-80 object-cover"
                loading="lazy"
                decoding="async"
              />
              <img
                src="/images/ChickenKebab.jpeg"
                alt="Delicious grilled chicken kebab on traditional banana leaf"
                className="rounded-2xl shadow-2xl w-full h-48 xs:h-56 sm:h-60 md:h-64 lg:h-72 xl:h-80 object-cover mt-6 xs:mt-8"
                loading="lazy"
                decoding="async"
              />
            </div>
            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-4 -right-4 xs:-bottom-6 xs:-right-6 bg-gradient-to-r from-brand-gold to-brand-orange rounded-2xl p-4 xs:p-5 sm:p-6 shadow-2xl"
            >
              <div className="text-center">
                <div className="text-2xl xs:text-3xl sm:text-4xl font-bold text-brand-charcoal-dark">15+</div>
                <div className="text-xs xs:text-sm font-semibold text-brand-charcoal">
                  Years of Excellence
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block bg-brand-gold/10 border border-brand-gold/30 rounded-full px-4 xs:px-5 sm:px-6 py-2 mb-4 xs:mb-5 sm:mb-6">
              <span className="text-brand-gold font-semibold text-xs xs:text-sm sm:text-base">ABOUT US</span>
            </div>
            <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-display mb-4 xs:mb-5 sm:mb-6">
              A Legacy of <span className="text-brand-gold">Flavor</span> and{' '}
              <span className="text-brand-red">Tradition</span>
            </h2>
            <p className="text-gray-300 text-base xs:text-lg sm:text-xl mb-4 xs:mb-5 sm:mb-6 leading-relaxed">
              For over 15 years, Brothers Biriyani has been serving authentic
              Naati Style Bucket Biriyani that captures the essence of traditional Indian
              cuisine. Our secret? Premium ingredients, time-honored recipes, and a
              passion for perfection passed down through generations.
            </p>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Every grain of rice is carefully selected, every spice is
              hand-blended, and every dish is prepared with the same love and care
              we'd serve our own family. We believe food is more than just
              sustenance—it's an experience, a celebration, and a way to bring
              people together.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="bg-brand-charcoal-dark rounded-xl p-4 border border-brand-gold/20 hover:border-brand-gold/40 transition-colors"
                >
                  <stat.icon className="text-brand-gold mb-2" size={32} />
                  <div className="text-2xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
