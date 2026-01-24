export function normalizeReddit(item) {
  return {
    id: `reddit-${item.id}`,
    title: item.title || null,
    url: item.url || null,
    author: item.author || null,
    source: "reddit",
    publishedAt: item.created_utc ? new Date(item.created_utc * 1000).toISOString() : null,
    fetchedAt: new Date().toISOString(),
  };
}
