import React, { useEffect } from 'react';
import { HeroSection } from '../components/sections/HeroSection';
import { ServicesSection } from '../components/sections/ServicesSection';
import { PortfolioSection } from '../components/sections/PortfolioSection';
import { ContactSection } from '../components/sections/ContactSection';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  useEffect(() => {
    // Add dark mode by default if not present
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="bg-background min-h-screen text-foreground selection:bg-primary/30 selection:text-primary">
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <PortfolioSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
