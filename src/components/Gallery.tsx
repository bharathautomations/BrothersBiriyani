import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const Gallery = () => {
  const images = [
    { src: '/images/ChickenBiriyaniWithKebab.jpeg', alt: 'Chicken Biriyani with Kebab' },
    { src: '/images/ChickenDumBiriyani.jpeg', alt: 'Chicken Dum Biriyani' },
    { src: '/images/MuttonBiriyani.jpeg', alt: 'Mutton Biriyani' },
    { src: '/images/ChickenKebab.jpeg', alt: 'Chicken Kebab' },
    { src: '/images/ChickenLollipop.jpeg', alt: 'Chicken Lollipop' },
    { src: '/images/KaalSoup.jpeg', alt: 'Kaal Soup' },
  ];

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Close lightbox on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedImage) {
        setSelectedImage(null);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedImage]);

  return (
    <section id="gallery" className="py-12 xs:py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32 bg-brand-charcoal relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-radial from-brand-gold/5 to-transparent" />

      <div className="max-w-[1600px] mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 xs:mb-12 sm:mb-14 md:mb-16"
        >
          <div className="inline-block bg-brand-gold/10 border border-brand-gold/30 rounded-full px-4 xs:px-5 sm:px-6 py-2 mb-4 xs:mb-5 sm:mb-6">
            <span className="text-brand-gold font-semibold text-xs xs:text-sm sm:text-base">GALLERY</span>
          </div>
          <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-display mb-3 xs:mb-4">
            A Feast for <span className="text-gradient">Your Eyes</span>
          </h2>
          <p className="text-base xs:text-lg sm:text-xl md:text-xl text-gray-400 max-w-2xl mx-auto">
            Take a visual journey through our delicious creations
          </p>
        </motion.div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-4 xs:gap-5 sm:gap-6" role="list">
          {images.map((image, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedImage(image.src)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedImage(image.src);
                }
              }}
              className="group relative h-56 xs:h-64 sm:h-72 md:h-80 lg:h-80 xl:h-96 rounded-2xl overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-brand-charcoal"
              role="listitem"
              aria-label={`View ${image.alt} in full size`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-xl font-bold">{image.alt}</h3>
                </div>
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/30 rounded-full blur-3xl" />
              </div>
            </motion.button>
          ))}
        </div>

        {/* Lightbox */}
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
                e.preventDefault();
                setSelectedImage(null);
              }
            }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
            role="dialog"
            aria-modal="true"
            aria-label="Image lightbox. Press Escape to close."
            tabIndex={0}
          >
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={selectedImage}
              alt={images.find(img => img.src === selectedImage)?.alt || 'Full size image'}
              className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl"
            />
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
