type ClassValue = string | false | null | undefined;

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(" ");
}

export async function apiGet<T>(url: string): Promise<T> {
  const cacheKey = `drewberry:api:${url}`;
  const canUseCache =
    typeof window !== "undefined" &&
    (url.startsWith("/api/movies") || url.startsWith("/api/tmdb/home"));
  const cacheMaxAge = 1000 * 60 * 30;

  if (canUseCache) {
    try {
      const cached = window.localStorage.getItem(cacheKey);

      if (cached) {
        const parsed = JSON.parse(cached) as { savedAt: number; data: T };

        if (Date.now() - parsed.savedAt < cacheMaxAge) {
          return parsed.data;
        }
      }
    } catch {
      window.localStorage.removeItem(cacheKey);
    }
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data = (await response.json()) as T;

  if (canUseCache) {
    try {
      window.localStorage.setItem(
        cacheKey,
        JSON.stringify({ savedAt: Date.now(), data }),
      );
    } catch {
      // Ignore storage quota/private-mode failures.
    }
  }

  return data;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function moviePath(id: string | number, title: string) {
  const slug = slugify(title);

  return slug ? `/movies/${id}/${slug}` : `/movies/${id}`;
}
