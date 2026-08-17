import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Our Menu', href: '#menu' },
    { name: 'About Us', href: '#about' },
    { name: 'Why Us', href: '#why-us' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-brand-charcoal-dark/95 backdrop-blur-lg shadow-2xl py-3'
          : 'bg-gradient-to-b from-brand-charcoal-dark/80 to-transparent backdrop-blur-sm py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo - Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center"
          >
            <a href="#home" className="flex items-center" aria-label="Brothers Biriyani Home">
              <img 
                src="/logo.png" 
                alt="Brothers Biriyani Logo" 
                className={`w-auto object-contain transition-all duration-300 ${
                  isScrolled ? 'h-8 xs:h-9 sm:h-10 md:h-11 lg:h-12' : 'h-10 xs:h-11 sm:h-12 md:h-13 lg:h-14'
                }`}
                loading="eager"
                fetchPriority="high"
                onError={(e) => {
                  // Fallback to text logo if image not found
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling;
                  if (fallback) fallback.classList.remove('hidden');
                }}
              />
              <div className="hidden text-2xl md:text-3xl font-bold font-display">
                <span className="text-brand-gold glow-gold">Brothers</span>
                <span className="text-brand-red glow-red">Biriyani</span>
              </div>
            </a>
          </motion.div>

          {/* Desktop Navigation - Center/Right */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6 2xl:space-x-8">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-sm xl:text-base 2xl:text-lg text-gray-300 hover:text-brand-gold transition-colors font-medium relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-gold transition-all duration-300 group-hover:w-full"></span>
              </motion.a>
            ))}
            
            {/* Primary CTA */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="btn-primary text-sm py-2.5 px-8"
              aria-label="Order food online"
            >
              Order Now
            </motion.button>
          </div>

          {/* Mobile - Logo, Hamburger & Order Now */}
          <div className="lg:hidden flex items-center space-x-3">
            <button className="btn-primary text-xs py-2 px-4" aria-label="Order food online">
              Order Now
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-brand-gold hover:text-brand-orange transition-colors p-1 focus:outline-none focus:ring-2 focus:ring-brand-gold rounded"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-brand-charcoal-dark/98 backdrop-blur-xl border-t border-brand-gold/20"
            role="menu"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-1">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-gray-300 hover:text-brand-gold hover:bg-brand-gold/10 transition-all text-lg font-medium py-3 px-4 rounded-lg"
                >
                  {link.name}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
