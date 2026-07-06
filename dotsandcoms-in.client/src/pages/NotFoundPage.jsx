import InnerBanner from "../components/ui/InnerBanner";
import SitemapGrid from "../components/SitemapGrid";

export default function NotFoundPage() {
  return (
    <>
      <InnerBanner
        title="404 - Page Not Found"
        subtitle="The page you are looking for might have been moved, deleted, or doesn't exist. Find your way using our sitemap directory below."
        breadcrumbs={[{ label: "Page Not Found" }]}
      />
      <SitemapGrid />
    </>
  );
}
