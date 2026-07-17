import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ndabasattorneys.co.za';
  
  // Publicly accessible legal practice routes for search indexers
  const routes = [
    '',
    '/about',
    '/contact',
    '/services',
    '/fees',
    '/faq',
    '/track',
    '/onboard',
    '/lpc-compliance',
    '/fica-rules',
    '/popia-policy',
    '/deeds-registry',
    '/offices',
    '/disclaimer',
    '/privacy',
    '/terms'
  ];

  return routes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: route === '' ? 'weekly' as const : 'monthly' as const,
    priority: route === '' ? 1.0 : route === '/services' || route === '/fees' ? 0.8 : 0.5,
  }));
}