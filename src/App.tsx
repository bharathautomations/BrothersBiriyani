import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BrandHighlights from './components/BrandHighlights';
import MenuSection from './components/MenuSection';
import SpecialOfferBanner from './components/SpecialOfferBanner';
import AboutSection from './components/AboutSection';
import WhyChooseUs from './components/WhyChooseUs';
import Gallery from './components/Gallery';
import Testimonials from './components/Testimonials';
import CTASection from './components/CTASection';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-brand-charcoal-dark">
      {/* Skip to main content link for keyboard navigation */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content">
        <Hero />
        <BrandHighlights />
        <MenuSection />
        <SpecialOfferBanner />
        <AboutSection />
        <WhyChooseUs />
        <Gallery />
        <Testimonials />
        <CTASection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
