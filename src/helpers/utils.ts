import { ParsedUrlQuery } from 'querystring';
import * as urlparse from 'url';

export function parseURL(url: string): {
  path: string;
  query: Record<string, string> | ParsedUrlQuery;
} {
  const parsedUrl = urlparse.parse(url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path?.replace(/^\/+|\/+$/g, '');
  return {
    path: trimmedPath || '',
    query: parsedUrl.query,
  };
}
