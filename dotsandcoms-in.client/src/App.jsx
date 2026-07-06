import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Home from "./components/Home";
import Home2 from "./components/Home2";
import ContactPage from "./pages/ContactPage";
import AppLayout from "./layout/AppLayout";
import FaqPage from "./pages/FaqPage";
import TechnicalSupportPage from "./pages/TechnicalSupportPage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import WorkPage from "./pages/WorkPage";
import WebDesignDetail from "./pages/services/WebDesignDetail";
import MobileAppsDetail from "./pages/services/MobileAppsDetail";
import WebHostingDetail from "./pages/services/WebHostingDetail";
import DigitalMarketingDetail from "./pages/services/DigitalMarketingDetail";
import WebStoriesPage from "./pages/WebStoriesPage";
import TermsPage from "./pages/TermsPage";
import SitemapPage from "./pages/SitemapPage";
import NotFoundPage from "./pages/NotFoundPage";
import AccutechCaseStudyPage from "./pages/AccutechCaseStudyPage";
import OneLifeCaseStudyPage from "./pages/OneLifeCaseStudyPage";
import KiiaraCaseStudyPage from "./pages/KiiaraCaseStudyPage";

// Scroll helper to support both top-of-page scrolling and dynamic #hash scrolling in Single Page App navigations
function ScrollToHashElement() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        const timer = setTimeout(() => {
          if (window.lenis) {
            window.lenis.scrollTo(element);
          } else {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
        return () => clearTimeout(timer);
      }
    } else {
      if (window.lenis) {
        window.lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
    }
  }, [pathname, hash]);

  return null;
}

// Dynamic canonical tag updater for SEO across pages
function CanonicalLink() {
  const { pathname } = useLocation();

  useEffect(() => {
    let link = document.querySelector("link[rel='canonical']");
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    const base = "https://www.dotsandcoms.in";
    const normalizedPath = pathname.endsWith("/") && pathname !== "/"
      ? pathname.slice(0, -1)
      : pathname;
      
    link.setAttribute("href", `${base}${normalizedPath}`);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToHashElement />
      <CanonicalLink />
      <Routes>
        <Route path="/" element={<Home />} />
              <Route path="/home-2" element={<Home2 />} />   
              <Route element={<AppLayout />}>
                  <Route path="/about-web-development-company-baroda" element={<AboutPage />} />
                  <Route path="/website-mobile-app-development-company-portfolio-baroda" element={<WorkPage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/responsive-website-designing-company-vadodara" element={<WebDesignDetail />} />
                  <Route path="/android-ios-mobile-app-development-company-baroda" element={<MobileAppsDetail />} />
                  <Route path="/windows-web-hosting-service-provider-baroda" element={<WebHostingDetail />} />
                  <Route path="/digital-marketing-company-vadodara" element={<DigitalMarketingDetail />} />
                  <Route path="/contact-webdesign-mobileapp-socialmedia-marketing-baroda" element={<ContactPage />} />
                  <Route path="/webhosting-vps-dedicated-server-support-baroda" element={<TechnicalSupportPage />} />
                  <Route path="/frequently-asked-questions" element={<FaqPage />} />
                  <Route path="/web-stories" element={<WebStoriesPage />} />
                  <Route path="/terms-and-conditions" element={<TermsPage />} />
                  <Route path="/sitemap" element={<SitemapPage />} />
                  <Route path="/accutechlabels-case-study-traditional-to-web-business" element={<AccutechCaseStudyPage />} />
                  <Route path="/1life-case-study-of-regional-to-national-reach" element={<OneLifeCaseStudyPage />} />
                  <Route path="/hobby-goes-global-case-study" element={<KiiaraCaseStudyPage />} />
                  <Route path="/*" element={<NotFoundPage />} />
              </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;