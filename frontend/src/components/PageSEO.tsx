import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { getMetaForPath, SITE_URL } from "@/lib/seo";

/**
 * Sets document title and meta tags per route for SEO.
 * Uses react-helmet-async so crawlers that run JS see updated head.
 */
export function PageSEO() {
  const { pathname } = useLocation();
  const meta = getMetaForPath(pathname);

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      {meta.noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <>
          <link rel="canonical" href={`${SITE_URL}${pathname === "/" ? "/" : pathname}`} />
          <meta property="og:title" content={meta.title} />
          <meta property="og:description" content={meta.description} />
          <meta property="og:url" content={`${SITE_URL}${pathname === "/" ? "/" : pathname}`} />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={meta.title} />
          <meta name="twitter:description" content={meta.description} />
        </>
      )}
    </Helmet>
  );
}
