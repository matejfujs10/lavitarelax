import { Helmet } from "react-helmet-async";

export const SITE_URL = "https://www.lavitaterme3000.com";

interface SeoHeadProps {
  title: string;
  description: string;
  /** Path starting with "/" — used for canonical and og:url */
  path: string;
  /** Absolute image URL for social previews */
  image?: string;
  type?: "website" | "article";
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Per-route head tags. Sitewide og:* stay in index.html as the fallback
 * for social crawlers that don't execute JavaScript.
 */
export const SeoHead = ({
  title,
  description,
  path,
  image = `${SITE_URL}/og-image.jpg`,
  type = "website",
  noindex = false,
  jsonLd,
}: SeoHeadProps) => {
  const url = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:image" content={image} />
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};
