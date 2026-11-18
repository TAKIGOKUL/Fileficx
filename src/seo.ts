import { GUIDES, getGuide } from './data/guides';

/**
 * Public origin of the site. Set VITE_SITE_URL (e.g. in Netlify env vars) when you move to a custom domain.
 * Canonical tags, Open Graph URLs, sitemap.xml and robots.txt are all generated from this value.
 */
export const SITE_URL = (import.meta.env?.VITE_SITE_URL || 'https://fileficx.netlify.app').replace(/\/+$/, '');

export interface PageSeo {
  path: string;
  title: string;
  description: string;
  /** Whether ads may be requested on this screen (only pages with substantial publisher content) */
  ads: boolean;
}

const DEFAULT_DESCRIPTION =
  'Free in-browser photo, signature, PDF and Word resizer for exam, job and visa applications. Hit exact pixels, KB and DPI. Files never leave your device.';

export function seoFor(page: string, slug?: string): PageSeo {
  switch (page) {
    case 'about':
      return {
        path: '/about',
        title: 'About Fileficx: Private, In-Browser File Formatting',
        description: 'Why we built Fileficx and how it formats application photos, signatures and documents without uploading them anywhere.',
        ads: true,
      };
    case 'privacy':
      return { path: '/privacy', title: 'Privacy Policy | Fileficx', description: 'How Fileficx handles data, cookies and advertising. Your files are processed only on your device.', ads: false };
    case 'terms':
      return { path: '/terms', title: 'Terms and Conditions | Fileficx', description: 'Terms of use for the Fileficx photo and document formatting tools.', ads: false };
    case 'contact':
      return { path: '/contact', title: 'Contact & Support | Fileficx', description: 'Get help with Fileficx or send feedback about photo, signature and document formatting.', ads: false };
    case 'guides': {
      const g = slug ? getGuide(slug) : undefined;
      if (slug && !g) return { path: `/guides/${slug}`, title: 'Guide not found | Fileficx', description: DEFAULT_DESCRIPTION, ads: false };
      if (g) return { path: `/guides/${g.slug}`, title: `${g.title} | Fileficx Guides`, description: g.summary, ads: true };
      return {
        path: '/guides',
        title: 'Guides: Photo, Signature & PDF Requirements | Fileficx',
        description: 'Plain-language guides on application photo sizes, signatures, DPI, PDF compression and keeping your documents private.',
        ads: true,
      };
    }
    default:
      return {
        path: '/',
        title: 'Fileficx: Free Photo, Signature & PDF Resizer for Exam and Visa Forms',
        description: DEFAULT_DESCRIPTION,
        ads: true,
      };
  }
}

/** Every URL that should be pre-rendered and listed in the sitemap. */
export const ROUTES: string[] = ['/', '/guides', ...GUIDES.map((g) => `/guides/${g.slug}`), '/about', '/contact', '/privacy', '/terms'];
