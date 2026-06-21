/**
 * Seo
 *
 * Centralised SEO component. Wraps react-helmet-async to inject:
 *   - per-language <title> and <meta description>
 *   - canonical URL for the current language
 *   - hreflang alternates (fr / en / it / nl + x-default → /fr)
 *   - Open Graph + Twitter tags
 *   - JSON-LD (RealEstateAgent)
 *
 * Paths are language-prefixed (/fr, /en, /it, /nl) and the current pathname
 * (e.g. /fr/collection) is parsed to find the "page slug" so alternates can
 * point at the same logical page in every language.
 */

import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/i18n';
import { getLangFromPath } from '@/i18n/routing';

// Placeholder — replace with the real production domain in Phase 5.
const SITE_URL = 'https://mavericks.ma';

/**
 * Strip the leading "/:lang" segment from a pathname, returning the rest.
 *
 *   /fr             → ''
 *   /fr/collection  → '/collection'
 *   /en/x/y         → '/x/y'
 */
function stripLangSegment(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0) return '';
  if (SUPPORTED_LANGUAGES.includes(parts[0])) parts.shift();
  return parts.length ? '/' + parts.join('/') : '';
}

export default function Seo({
  titleKey = 'meta.title',
  descriptionKey = 'meta.description',
}) {
  const { t } = useTranslation();
  const location = useLocation();

  const currentLang = getLangFromPath(location.pathname) ?? DEFAULT_LANGUAGE;
  const slug = stripLangSegment(location.pathname); // '' for homepage

  const title = t(titleKey);
  const description = t(descriptionKey);
  const ogTitle = t('meta.ogTitle', { defaultValue: title });
  const ogDescription = t('meta.ogDescription', { defaultValue: description });

  const canonical = `${SITE_URL}/${currentLang}${slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Mavericks',
    description,
    url: canonical,
    areaServed: {
      '@type': 'City',
      name: 'Marrakech',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'MA',
        addressLocality: 'Marrakech',
      },
    },
  };

  return (
    <Helmet>
      <html lang={currentLang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Hreflang alternates — one per supported language, plus x-default
          pointing at the default language (FR). */}
      {SUPPORTED_LANGUAGES.map((lng) => (
        <link
          key={lng}
          rel="alternate"
          hrefLang={lng}
          href={`${SITE_URL}/${lng}${slug}`}
        />
      ))}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${SITE_URL}/${DEFAULT_LANGUAGE}${slug}`}
      />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Mavericks" />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:locale" content={currentLang} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />

      {/* JSON-LD */}
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}
