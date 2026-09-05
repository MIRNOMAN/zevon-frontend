/**
 * Resolves avatar image URLs whether they are absolute URLs, data URIs, or relative backend uploads.
 */
export function getAvatarUrl(url?: string | null): string | null {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  const backendBase = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000").replace(/\/api\/v1\/?$/, "");
  return `${backendBase}${url.startsWith("/") ? "" : "/"}${url}`;
}
