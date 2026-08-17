import { motion } from 'framer-motion';
import { Star, ShoppingCart } from 'lucide-react';

interface FoodCardProps {
  name: string;
  description: string;
  price: string;
  image: string;
  rating: number;
  isPopular?: boolean;
  delay?: number;
}

const FoodCard = ({
  name,
  description,
  price,
  image,
  rating,
  isPopular,
  delay = 0,
}: FoodCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="group relative bg-gradient-to-br from-brand-charcoal to-brand-charcoal-dark rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-brand-gold/10 hover:border-brand-gold/30 h-full flex flex-col"
    >
      {/* Popular Badge */}
      {isPopular && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute top-4 right-4 z-10 bg-gradient-to-r from-brand-red to-brand-orange text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse"
        >
          POPULAR
        </motion.div>
      )}

      {/* Image Container */}
      <div className="relative h-48 xs:h-52 sm:h-56 md:h-60 lg:h-64 xl:h-72 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal-dark via-transparent to-transparent opacity-60" />
      </div>

      {/* Content */}
      <div className="p-4 xs:p-5 sm:p-6 flex-1 flex flex-col">
        {/* Rating */}
        <div className="flex items-center space-x-1 mb-2 xs:mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={
                i < rating
                  ? 'fill-brand-gold text-brand-gold'
                  : 'text-gray-600'
              }
            />
          ))}
          <span className="text-xs xs:text-sm text-gray-400 ml-2">({rating}.0)</span>
        </div>

        {/* Name */}
        <h3 className="text-lg xs:text-xl sm:text-xl md:text-xl lg:text-2xl font-bold text-white mb-2 group-hover:text-brand-gold transition-colors">
          {name}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-xs xs:text-sm sm:text-sm mb-4 line-clamp-3 leading-relaxed flex-1">
          {description}
        </p>

        {/* Price & Action */}
        <div className="flex items-center justify-between mt-auto">
          <div className="text-xl xs:text-2xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-gradient">{price}</div>
          <motion.button
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-brand-gold to-brand-orange text-brand-charcoal-dark p-2.5 xs:p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-brand-charcoal"
            aria-label={`Add ${name} to cart for ${price}`}
          >
            <ShoppingCart size={18} aria-hidden="true" />
          </motion.button>
        </div>
      </div>

      {/* Premium Hover Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-gold/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-brand-red/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-brand-orange/20 rounded-full blur-2xl" />
      </div>
    </motion.div>
  );
};

export default FoodCard;
