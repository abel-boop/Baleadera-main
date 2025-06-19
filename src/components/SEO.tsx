import { Helmet, HelmetProvider } from 'react-helmet-async';

// Structured data for local business
// Base URL for all absolute paths
const baseUrl = process.env.NODE_ENV === 'production' 
  ? 'https://baleadera-tiweled.org' 
  : 'http://localhost:3000';

// Cache busting parameter
const cacheBuster = `?v=${Date.now()}`;

const localBusinessStructuredData = {
  "@context": "https://schema.org",
  "@type": "ChristianChurch",
  "name": "Balaadera Tiweled",
  "alternateName": "Trustee Generation the Chosen Camp",
  "description": "Balaadera Tiweled (Trustee Generation the Chosen Camp) in Hawassa, Ethiopia. Join our leadership program for young believers aged 14-19. Empowering the next generation of Christian leaders in Southern Ethiopia.",
  "image": `${baseUrl}/trustee-generation-share.png${cacheBuster}`,
  "url": "https://baleadera-tiweled.org/",
  "telephone": "+251-XXX-XXXXXX",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[Your Street Address]",
    "addressLocality": "Hawassa",
    "addressRegion": "SNNPR",
    "postalCode": "1577",
    "addressCountry": "ET"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "7.0619",
    "longitude": "38.4764"
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday"
    ],
    "opens": "09:00",
    "closes": "17:00"
  },
  "sameAs": [
    "https://www.facebook.com/baleadera-tiweled",
    "https://twitter.com/baleadera-tiweled",
    "https://www.instagram.com/baleadera-tiweled"
  ]
};

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
  twitterCard?: string;
  twitterSite?: string;
}

export const SEO = ({
  title = "Trustee Generation the Chosen Camp",
  description = "Join the Trustee Generation — a movement of young warriors rising up to lead with God's love, live with unshakable purpose, and bring real change to their communities through divine wisdom.",
  image = "https://baleadera-tiweled.org/trustee-generation-share.jpg",
  url = "https://baleadera-tiweled.org/",
  type = "website",
  siteName = "Trustee Generation the Chosen Camp",
  twitterCard = "summary_large_image",
  twitterSite = "@baleadera-tiweled",
}: SEOProps) => {
  // Create JSON-LD script for structured data with current URL
  const currentUrl = typeof window !== 'undefined' ? window.location.href : baseUrl;
  const fullImageUrl = `${baseUrl}/trustee-generation-share.png${cacheBuster}`;
  
  const structuredData = JSON.stringify({
    ...localBusinessStructuredData,
    url: currentUrl,
    image: fullImageUrl
  });

  return (
    <Helmet>
      {/* JSON-LD for Local Business */}
      <script type="application/ld+json">
        {structuredData}
      </script>
      
      {/* Viewport */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      
      {/* Geo Meta Tags */}
      <meta name="geo.region" content="ET-SN" />
      <meta name="geo.placename" content="Hawassa" />
      <meta name="geo.position" content="7.0619;38.4764" />
      <meta name="ICBM" content="7.0619, 38.4764" />
      
      {/* Local Business Info */}
      <meta name="business:contact_data:locality" content="Hawassa" />
      <meta name="business:contact_data:region" content="SNNPR" />
      <meta name="business:contact_data:country_name" content="Ethiopia" />
      
      {/* Mobile Specific Meta */}
      <meta name="theme-color" content="#1e40af" />
      <meta name="mobile-web-app-capable" content="yes" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="author" content="Trustee Generation" />
      <meta name="keywords" content="balaadera tiweled, trustee generation, leadership camp, youth camp, christian leadership, young believers, spiritual growth, Ethiopia, Hawassa, Sidama, SNNPR, Christian camp, youth ministry, Ethiopian youth, Christian leadership Ethiopia, spiritual growth camp, faith-based leadership, Christian youth Ethiopia, Hawassa youth programs" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${baseUrl}${image}${cacheBuster}`} />
      <meta property="og:image:secure_url" content={`${baseUrl}${image}${cacheBuster}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content={twitterSite} />
      <meta name="twitter:creator" content={twitterSite} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${baseUrl}${image}${cacheBuster}`} />
      <meta name="twitter:image:alt" content={`${title} - ${siteName}`} />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="theme-color" content="#1e40af" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-title" content={siteName} />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Favicon */}
      <link rel="icon" href={`${baseUrl}/favicon.ico${cacheBuster}`} type="image/x-icon" />
      <link rel="apple-touch-icon" href={`${baseUrl}/apple-touch-icon.png${cacheBuster}`} />
      <link rel="manifest" href={`${baseUrl}/site.webmanifest${cacheBuster}`} />
    </Helmet>
  );
};

export default SEO;
