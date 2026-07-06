import { useEffect } from "react";
import TechnicalSupport from "../components/TechnicalSupport/TechnicalSupport";
import InnerBanner from "../components/ui/InnerBanner";

function TechnicalSupportPage() {
  useEffect(() => {
    window.scrollTo(0, 0);

    // Set page-specific SEO metadata
    document.title = "Tech Support for Web Hosting & Cloud Hosting in Vadodara | Dots & Coms";

    let descMeta = document.querySelector("meta[name='description']");
    const originalDesc = descMeta ? descMeta.getAttribute("content") : "";
    if (descMeta) {
      descMeta.setAttribute(
        "content",
        "Technical support for Windows and Linux web hosting, VPS, cloud hosting, and dedicated servers in Vadodara with secure infrastructure and reliable hosting management."
      );
    }

    let keywordsMeta = document.querySelector("meta[name='keywords']");
    const originalKeywords = keywordsMeta ? keywordsMeta.getAttribute("content") : "";
    if (keywordsMeta) {
      keywordsMeta.setAttribute(
        "content",
        "web hosting Vadodara, windows hosting Vadodara, linux hosting Vadodara, VPS hosting Vadodara, cloud hosting Vadodara, dedicated server Vadodara, VPS provider India, secure hosting provider"
      );
    }

    let canonicalLink = document.querySelector("link[rel='canonical']");
    const originalCanonical = canonicalLink ? canonicalLink.getAttribute("href") : "";
    if (canonicalLink) {
      canonicalLink.setAttribute("href", "https://www.dotsandcoms.in/webhosting-vps-dedicated-server-support-baroda");
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
              title="Technical Support"
              subtitle="Submit server maintenance requests, track domain ticket statuses, or initiate troubleshooting protocols."
              breadcrumbs={[{ label: "Technical Support" }]}
          />
          <TechnicalSupport/>
      </>
  );
}

export default TechnicalSupportPage;