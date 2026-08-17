import { motion } from 'framer-motion';
import FoodCard from './FoodCard';

const MenuSection = () => {
  const menuItems = [
    {
      name: 'Chicken Dum Biriyani',
      description:
        'Slow-cooked perfection where turmeric-infused basmati embraces juicy chicken in a symphony of aromatic spices, served with tangy curry, fresh cilantro raita, and zesty lime.',
      price: '$12.99',
      image: '/images/ChickenDumBiriyani.jpeg',
      rating: 5,
      isPopular: true,
    },
    {
      name: 'Mutton Biriyani',
      description:
        'Long-grain basmati infused with saffron strands and whole spices, crowned with fall-apart-tender mutton, complemented by cooling raita, spicy curry, and crisp onions on fresh banana leaf.',
      price: '$15.99',
      image: '/images/MuttonBiriyani.jpeg',
      rating: 5,
      isPopular: true,
    },
    {
      name: 'Chicken Biriyani with Kebab',
      description:
        'Golden saffron-kissed basmati rice layered with tender chicken, accompanied by smoky charcoal-grilled kebabs, cooling mint raita, and aromatic spiced curry—a complete feast on a banana leaf.',
      price: '$16.99',
      image: '/images/ChickenBiriyaniWithKebab.jpeg',
      rating: 5,
      isPopular: true,
    },
    {
      name: 'Chicken Kebab',
      description:
        'Tandoori-spiced chicken pieces kissed by fire, featuring a deep crimson marinade of red chili, paprika, and garam masala, served with pink onion rings and fresh lime on a traditional banana leaf.',
      price: '$8.99',
      image: '/images/ChickenKebab.jpeg',
      rating: 5,
    },
    {
      name: 'Chicken Lollipop',
      description:
        'Crispy Indo-Chinese drumstick delights with a fiery red pepper coating, double-fried to golden perfection and garnished with tangy onion rings and a citrus squeeze.',
      price: '$9.99',
      image: '/images/ChickenLollipop.jpeg',
      rating: 4,
    },
    {
      name: 'Kaal Soup',
      description:
        'Rustic bone-in mutton soup simmered with earthy peppercorns, warming ginger, and aromatic star anise in a soul-soothing golden broth—a traditional remedy and delicacy.',
      price: '$6.99',
      image: '/images/KaalSoup.jpeg',
      rating: 5,
    },
    {
      name: 'Chicken Bucket Biriyani Mega',
      description:
        'Family-sized bucket overflowing with fragrant golden biriyani studded with succulent chicken pieces, served with tandoori kebabs, creamy raita, and rich curry for the ultimate sharing experience.',
      price: '$45.99',
      image: '/images/ChickenBucketBiriyaniMega.jpeg',
      rating: 5,
      isPopular: true,
    },
  ];

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
          {menuItems.map((item, index) => (
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
          <button className="btn-secondary text-lg px-10 py-4">
            View Full Menu
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default MenuSection;
