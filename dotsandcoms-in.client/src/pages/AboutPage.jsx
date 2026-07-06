import { useEffect } from "react";
import AboutUs from "../components/AboutUs/AboutUs";
import InnerBanner from "../components/ui/InnerBanner";

function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0);

    // Set page-specific SEO metadata
    document.title = "About Dots & Coms – Web Development Company in Baroda";

    let descMeta = document.querySelector("meta[name='description']");
    const originalDesc = descMeta ? descMeta.getAttribute("content") : "";
    if (descMeta) {
      descMeta.setAttribute(
        "content",
        "Learn about Dots & Coms, a web development company in Baroda with 19+ years of experience in website design, mobile app development, SEO services, and web hosting solutions."
      );
    }

    let keywordsMeta = document.querySelector("meta[name='keywords']");
    const originalKeywords = keywordsMeta ? keywordsMeta.getAttribute("content") : "";
    if (keywordsMeta) {
      keywordsMeta.setAttribute(
        "content",
        "web development company Baroda, website designing and development Vadodara, web hosting services Baroda, android and ios app development services, ecommerce website development, web based services, logo and brochure designing, SEO services Vadodara"
      );
    }

    let canonicalLink = document.querySelector("link[rel='canonical']");
    const originalCanonical = canonicalLink ? canonicalLink.getAttribute("href") : "";
    if (canonicalLink) {
      canonicalLink.setAttribute("href", "https://www.dotsandcoms.in/about-web-development-company-baroda");
    }

    // Restore site-wide defaults on unmount
    return () => {
      document.title = "Website Design & Mobile App Development Company in Vadodara";
      if (descMeta) descMeta.setAttribute("content", originalDesc);
      if (keywordsMeta) keywordsMeta.setAttribute("content", originalKeywords);
      if (canonicalLink) canonicalLink.setAttribute("href", originalCanonical);
    };
  }, []);

  return (
      <>
          <InnerBanner
              title="About Us"
              subtitle="Pioneering custom web design, mobile products, and high-speed cloud engineering since 1999."
              breadcrumbs={[{ label: "About Us" }]}
          />
          <AboutUs/>

      </>
  );
}

export default AboutPage;