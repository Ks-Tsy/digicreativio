import { ContactHeroSection } from "@/components/sections/ContactHeroSection";
import { ContactPageInfoSection } from "@/components/sections/ContactPageInfoSection";

const Contact = () => {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <ContactHeroSection />

      {/* Main Content */}
      <ContactPageInfoSection />
    </div>
  );
};

export default Contact;
