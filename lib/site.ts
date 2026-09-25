/** The single public identity used by metadata and structured data. */
export const SITE_URL = 'https://solvencert-novexa.vercel.app';
export const SITE_NAME = 'SolveNCERT';

/**
 * Brand lockup — "NDe" is the public-facing short name of the company
 * (easy to say, spell and remember in marketing). "NoirDemons" is the full
 * name and is never dropped: the two always ship together as
 *
 *     NDe
 *     NoirDemons
 *
 * Flat / non-HTML contexts (meta tags, JSON-LD, robots.txt, sitemaps, PDFs)
 * use the single-line form "NDe · NoirDemons".
 */
export const BRAND_SHORT = 'NDe';
export const BRAND_FULL = 'NoirDemons';
export const BRAND_LOCKUP = 'NDe · NoirDemons';

export const SITE_ALTERNATE_NAME = `SolveNCERT by NOVEXA · Now ${BRAND_LOCKUP}`;
export const PUBLISHER_NAME = 'NOVEXA';

/**
 * Every spelling a person might type into Google so the brand resolves to
 * this product: NDe / NDE / nde / nDe / NdE / nDE, plus the full name.
 */
export const SITE_ALTERNATE_NAMES: string[] = [
  SITE_ALTERNATE_NAME,
  BRAND_LOCKUP,
  'NDe', 'NDE', 'nde', 'nDe', 'NdE', 'nDE',
  'NoirDemons', 'Noir Demons', 'noirdemons', 'NOVEXA',
];

/** Default SEO keywords — brand terms first so "nde" always maps here. */
export const BRAND_KEYWORDS =
  'NDe, NDE, nde, nDe, NdE, NoirDemons, Noir Demons, NOVEXA, SolveNCERT';
