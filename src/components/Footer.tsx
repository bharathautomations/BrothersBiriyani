import { motion } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  Heart,
} from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Menu', href: '#menu' },
    { name: 'About', href: '#about' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' },
  ];

  const menuCategories = [
    'Chicken Biriyani',
    'Mutton Biriyani',
    'Kebabs',
    'Starters',
    'Soups',
    'Beverages',
  ];

  return (
    <footer className="bg-brand-charcoal-dark border-t border-brand-gold/20 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-red/5 rounded-full blur-3xl" />

      <div className="max-w-[1600px] mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12 xs:py-14 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 xs:gap-10 sm:gap-12 mb-8 xs:mb-10 sm:mb-12">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-4">
              <img 
                src="/logo.png" 
                alt="Brothers Biriyani Logo" 
                className="h-12 xs:h-14 sm:h-16 w-auto object-contain mb-2"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  // Fallback to text logo if image not found
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling;
                  if (fallback) fallback.classList.remove('hidden');
                }}
              />
              <div className="hidden text-2xl font-bold font-display">
                <span className="text-brand-gold glow-gold">Brothers</span>
                <span className="text-brand-red glow-red">Biriyani</span>
              </div>
            </div>
            <p className="text-gray-400 mb-4 xs:mb-5 sm:mb-6 leading-relaxed text-sm xs:text-base">
              Serving authentic Naati Style Bucket Biriyani with love and tradition since
              2009. Every dish is a celebration of flavors.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-white font-bold text-base xs:text-lg mb-3 xs:mb-4">Quick Links</h3>
            <ul className="space-y-2 xs:space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-brand-gold transition-colors inline-flex items-center group"
                  >
                    <span className="w-0 h-0.5 bg-brand-gold group-hover:w-4 transition-all duration-300 mr-0 group-hover:mr-2" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Menu Categories */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-white font-bold text-lg mb-4">Menu</h3>
            <ul className="space-y-3">
              {menuCategories.map((category, index) => (
                <li key={index}>
                  <a
                    href="#menu"
                    className="text-gray-400 hover:text-brand-gold transition-colors inline-flex items-center group"
                  >
                    <span className="w-0 h-0.5 bg-brand-gold group-hover:w-4 transition-all duration-300 mr-0 group-hover:mr-2" />
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-white font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-gray-400">
                <MapPin className="text-brand-gold flex-shrink-0 mt-1" size={18} />
                <span>123 Biriyani Street, Food District, Your City 12345</span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="text-brand-gold flex-shrink-0 mt-1" size={18} />
                <a
                  href="tel:+1234567890"
                  className="text-gray-400 hover:text-brand-gold transition-colors"
                >
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="text-brand-gold flex-shrink-0 mt-1" size={18} />
                <a
                  href="mailto:info@brothersbiriyani.com"
                  className="text-gray-400 hover:text-brand-gold transition-colors"
                >
                  info@brothersbiriyani.com
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-brand-gold/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Brothers Biriyani. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm flex items-center">
              Made with <Heart className="text-brand-red mx-1" size={16} fill="currentColor" /> by Brothers Biriyani
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
