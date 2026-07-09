import { useEffect, useState } from "react";
import Lenis from "lenis";

// Custom global elements
import LoadingScreen from "./LoadingScreen";
import ParticleBackground from "./ParticleBackground";
import { setPageSEO } from "../utils/seo";

// Sections
import Header from "./Header";
import Hero2 from "./Hero2"; // Redesigned Hero v2
import Trust from "./Trust";
import About from "./About";
import Services2 from "./Services2"; // Redesigned Services v2
import FeaturedWork from "./FeaturedWork";
import Process from "./Process";
import WhyChooseUs from "./WhyChooseUs";
import ClientNetwork from "./ClientNetwork";
import TechStack from "./TechStack";
import { FreeAuditCTA } from "./FreeAuditCTA";
import Testimonials from "./Testimonials";
import Footer from "./Footer";
import WhatsAppButton from "./ui/WhatsAppButton";

import "../App.css";

export default function Home2() {
  const [isLoading, setIsLoading] = useState(!window.hasLoadedOnce);

  // Set page-specific SEO metadata on mount
  useEffect(() => {
    if (isLoading) return;
    return setPageSEO({
      title: "Website Design & Mobile App Development Company in Vadodara - Redesigned",
      description: "Dots & Coms is a leading website design and mobile app development company in Vadodara offering responsive web design, Android & iOS app development, web hosting, SEO, and digital marketing services.",
      keywords: "website design Vadodara, mobile app development Vadodara, web development company Vadodara, app developers Vadodara, website designing company Baroda, mobile application development Baroda, web hosting Vadodara, IT company Vadodara, software development Vadodara, SEO company Vadodara, digital marketing Vadodara",
      canonical: "https://www.dotsandcoms.in/home-2"
    });
  }, [isLoading]);

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    if (isLoading) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing
      smoothWheel: true,
      wheelMultiplier: 1,
      infinite: false,
    });

    window.lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      window.lenis = null;
    };
  }, [isLoading]);

  return (
    <>
      <LoadingScreen onComplete={() => setIsLoading(false)} />
      
      {!isLoading && (
        <div className="relative min-h-screen text-slate-600 bg-[#f8fafc]">
          {/* Custom interactive elements */}
          <ParticleBackground />

          {/* Navigation */}
          <Header />

          {/* Page Sections */}
          <main>
            <Hero2 />
            <Trust />
            <About />
            <Services2 />
            <FeaturedWork />
            <Process />
            <WhyChooseUs />
            <ClientNetwork />
            <TechStack />
            <FreeAuditCTA />
            <Testimonials />
          </main>

          {/* Footer */}
          <Footer />

          {/* Floating WhatsApp Button */}
          <WhatsAppButton />
        </div>
      )}
    </>
  );
}
