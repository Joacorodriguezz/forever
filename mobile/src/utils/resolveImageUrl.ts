import { API_URL } from '../config/api';

export function resolveImageUrl(path?: string | null): string | null {
  if (!path?.trim()) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const base = API_URL.replace(/\/api\/?$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
