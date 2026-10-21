import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import FoodCard from './FoodCard';
import OrderingButtons from './OrderingButtons';
import { signatureDishes, menuCategories } from '../data/menu';

const MenuSection = () => {
  const [showFullMenu, setShowFullMenu] = useState(false);

  return (
    <section id="menu" className="py-20 bg-brand-charcoal-dark relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-red/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block bg-brand-gold/10 border border-brand-gold/30 rounded-full px-6 py-2 mb-6"
          >
            <span className="text-brand-gold font-semibold">OUR MENU</span>
          </motion.div>
          <h2 className="section-title text-gradient mb-4">
            Our Signature Dishes
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Made to satisfy every craving.
          </p>
        </motion.div>

        {/* Menu Grid - Responsive for all screen sizes */}
        <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6 xs:gap-7 sm:gap-8 md:gap-8 lg:gap-10 xl:gap-12">
          {signatureDishes.map((item, index) => (
            <FoodCard key={index} {...item} delay={index * 0.1} />
          ))}
        </div>

        {/* View Full Menu CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button
            onClick={() => setShowFullMenu((prev) => !prev)}
            className="btn-secondary text-lg px-10 py-4 inline-flex items-center gap-2"
            aria-expanded={showFullMenu}
            aria-controls="full-menu-list"
          >
            {showFullMenu ? 'Hide Full Menu' : 'View Full Menu'}
            <motion.span animate={{ rotate: showFullMenu ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown size={20} />
            </motion.span>
          </button>
        </motion.div>

        {/* Full Menu - categorized list of every item on the physical menu card */}
        <AnimatePresence>
          {showFullMenu && (
            <motion.div
              id="full-menu-list"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden mt-10"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 max-w-5xl mx-auto">
                {menuCategories.map((category) => (
                  <div key={category.id}>
                    <h3 className="text-brand-gold font-bold text-lg uppercase tracking-wide mb-4 border-b border-brand-gold/20 pb-2">
                      {category.name}
                    </h3>
                    <ul className="space-y-3">
                      {category.items.map((item) => (
                        <li key={item.name} className="flex items-baseline justify-between gap-4">
                          <span className="text-gray-300">{item.name}</span>
                          <span className="flex-1 border-b border-dashed border-gray-700 mx-2" />
                          <span className="text-brand-gold font-semibold">{item.price}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Order for delivery - separate from the full menu/table booking above */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <p className="text-gray-400 mb-4">Craving delivery instead? Order now:</p>
          <OrderingButtons className="justify-center" />
        </motion.div>
      </div>
    </section>
  );
};

export default MenuSection;

