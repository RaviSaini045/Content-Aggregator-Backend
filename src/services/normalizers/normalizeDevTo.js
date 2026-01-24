export function normalizeDevTo(item) {
  return {
    id: `devto-${item.id}`,
    title: item.title || null,
    url: item.url || null,
    author: item.user?.username || null,
    source: "devto",
    publishedAt: item.published_at,
    fetchedAt: new Date().toISOString(),
  };
}
