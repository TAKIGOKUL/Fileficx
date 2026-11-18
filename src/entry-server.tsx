import React from 'react';
import { renderToString } from 'react-dom/server';
import { App } from './App';
import { GUIDES } from './data/guides';

export { ROUTES, SITE_URL, seoFor } from './seo';
export { GUIDES };

/** Render a route to static HTML for crawlers and first paint. */
export function render(path: string): string {
  return renderToString(
    <React.StrictMode>
      <App initialPath={path} />
    </React.StrictMode>
  );
}
