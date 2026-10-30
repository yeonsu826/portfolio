import { Analytics } from '@vercel/analytics/react';
import { useLocation } from 'react-router-dom';

export default function WebAnalytics() {
  const { pathname } = useLocation();

  // GitHub Pages and local builds do not provide Vercel's collection endpoint.
  if (!import.meta.env.VITE_VERCEL_ANALYTICS_ENABLED) return null;

  // HashRouter routes need explicit paths; filter changes stay on the same page.
  return <Analytics mode="production" route={pathname} path={pathname} />;
}
