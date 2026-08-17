import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Food Enthusiast',
      review:
        'The best biriyani I\'ve had outside of Hyderabad! The flavors are authentic, and the spices are perfectly balanced. Brothers Biriyani has become our family\'s go-to for special occasions.',
      rating: 5,
      image: 'https://i.pravatar.cc/150?img=12',
    },
    {
      name: 'Priya Sharma',
      role: 'Regular Customer',
      review:
        'Their mutton biriyani is absolutely divine! The meat is tender, the rice is perfectly cooked, and the aroma is incredible. Plus, their delivery is always on time and the food arrives hot.',
      rating: 5,
      image: 'https://i.pravatar.cc/150?img=45',
    },
    {
      name: 'Mohammed Ali',
      role: 'Biriyani Lover',
      review:
        'I\'ve tried biriyani from many places, but Brothers Biriyani stands out. The authenticity, the portion size, and the value for money are unmatched. Highly recommended!',
      rating: 5,
      image: 'https://i.pravatar.cc/150?img=33',
    },
  ];

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

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 xs:gap-7 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="group relative bg-brand-charcoal rounded-2xl p-6 xs:p-7 sm:p-8 border border-brand-gold/20 hover:border-brand-gold/40 transition-all duration-300 hover:-translate-y-2"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 text-brand-gold/20 group-hover:text-brand-gold/40 transition-colors">
                <Quote size={48} />
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className="fill-brand-gold text-brand-gold"
                  />
                ))}
              </div>

              {/* Review */}
              <p className="text-gray-300 leading-relaxed mb-6 relative z-10">
                "{testimonial.review}"
              </p>

              {/* Author */}
              <div className="flex items-center space-x-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-brand-gold/50"
                  loading="lazy"
                  decoding="async"
                />
                <div>
                  <h4 className="text-white font-bold">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </div>

              {/* Hover Glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl">
                <div className="absolute top-0 left-0 w-32 h-32 bg-brand-gold/10 rounded-full blur-2xl" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
