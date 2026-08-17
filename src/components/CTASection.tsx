import { motion } from 'framer-motion';
import { Phone, MapPin, Clock, Mail } from 'lucide-react';

const CTASection = () => {
  return (
    <section
      id="contact"
      className="py-12 xs:py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32 bg-brand-charcoal relative overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/MuttonBiriyani.jpeg"
          alt="Background"
          className="w-full h-full object-cover opacity-10"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-charcoal-dark/95 via-brand-charcoal/95 to-brand-charcoal-dark/95" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl" />

      <div className="max-w-[1600px] mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xs:gap-10 sm:gap-12 md:gap-14 lg:gap-16 items-center">
          {/* Left - CTA Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block bg-brand-gold/10 border border-brand-gold/30 rounded-full px-4 xs:px-5 sm:px-6 py-2 mb-4 xs:mb-5 sm:mb-6">
              <span className="text-brand-gold font-semibold text-xs xs:text-sm sm:text-base">
                ORDER NOW
              </span>
            </div>
            <h2 className="text-3xl xs:text-4xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold font-display mb-4 xs:mb-5 sm:mb-6">
              Craving Authentic <span className="text-gradient">Biriyani</span>?
            </h2>
            <p className="text-base xs:text-lg sm:text-xl md:text-xl mb-6 xs:mb-7 sm:mb-8 text-gray-300 leading-relaxed">
              Order now and get your favorite biriyani delivered hot and fresh to
              your doorstep in just 30 minutes. Special discounts available for
              first-time orders!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 xs:gap-4 mb-8 xs:mb-10 sm:mb-12">
              <button className="btn-primary text-base xs:text-lg px-8 xs:px-10 py-3 xs:py-4 w-full sm:w-auto">
                Order Online
              </button>
              <button className="btn-secondary text-base xs:text-lg px-8 xs:px-10 py-3 xs:py-4 w-full sm:w-auto">
                Call to Order
              </button>
            </div>

            {/* Special Offer Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="inline-block bg-gradient-to-r from-brand-red to-brand-orange text-white font-bold px-4 xs:px-5 sm:px-6 py-2.5 xs:py-3 rounded-full shadow-lg text-xs xs:text-sm sm:text-base"
            >
              🎉 20% OFF on First Order - Use Code: WELCOME20
            </motion.div>
          </motion.div>

          {/* Right - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* Contact Card */}
            <div className="bg-brand-charcoal-dark rounded-2xl p-8 border border-brand-gold/20">
              <h3 className="text-2xl font-bold text-white mb-6">
                Contact Information
              </h3>

              <div className="space-y-6">
                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-brand-gold to-brand-orange flex items-center justify-center">
                    <Phone className="text-white" size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Phone</h4>
                    <a
                      href="tel:+1234567890"
                      className="text-gray-400 hover:text-brand-gold transition-colors"
                    >
                      +1 (234) 567-890
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-brand-green to-brand-green-dark flex items-center justify-center">
                    <MapPin className="text-white" size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Address</h4>
                    <p className="text-gray-400">
                      123 Biriyani Street, Food District
                      <br />
                      Your City, State 12345
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-brand-red to-brand-red-dark flex items-center justify-center">
                    <Clock className="text-white" size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">
                      Opening Hours
                    </h4>
                    <p className="text-gray-400">
                      Monday - Sunday
                      <br />
                      11:00 AM - 11:00 PM
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-brand-orange to-brand-orange-dark flex items-center justify-center">
                    <Mail className="text-white" size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Email</h4>
                    <a
                      href="mailto:info@brothersbiriyani.com"
                      className="text-gray-400 hover:text-brand-gold transition-colors"
                    >
                      info@brothersbiriyani.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
