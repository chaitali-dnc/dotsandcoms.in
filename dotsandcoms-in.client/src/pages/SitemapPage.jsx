import InnerBanner from "../components/ui/InnerBanner";
import SitemapGrid from "../components/SitemapGrid";

export default function SitemapPage() {
  return (
    <>
      <InnerBanner
        title="Sitemap"
        subtitle="A comprehensive directory of pages, services, case studies, and corporate contact details at Dots & Coms."
        breadcrumbs={[{ label: "Sitemap" }]}
      />
      <SitemapGrid />
    </>
  );
}
