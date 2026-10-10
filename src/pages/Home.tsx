import React, { useEffect } from 'react';
import { PremiumHero } from '../components/home/PremiumHero';
import { Introduction } from '../components/home/Introduction';
import { Capabilities } from '../components/home/Capabilities';
import { SelectedWork } from '../components/home/SelectedWork';
import { WhyUs } from '../components/home/WhyUs';
import { Process } from '../components/home/Process';
import { PortfolioCTA } from '../components/home/PortfolioCTA';
import { CustomCursor } from '../components/home/CustomCursor';

const Home: React.FC = () => {
  useEffect(() => {
    // Add dark mode by default if not present
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="bg-[#050505] min-h-screen text-[#F5F5F5] selection:bg-[#D4AF37]/30 selection:text-[#F5F5F5] font-sans">
      <CustomCursor />
      
      <main>
        <PremiumHero />
        <Introduction />
        <Capabilities />
        <SelectedWork />
        <WhyUs />
        <Process />
        <PortfolioCTA />
      </main>
    </div>
  );
};

export default Home;
