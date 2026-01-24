export function normalizeHackerNews(item) {
  return {
    id: `hn-${item.id}`,
    title: item.title || null,
    url: item.url || null,
    author: item.by || null,
    source: "hackernews",
    publishedAt: item.time ? new Date(item.time * 1000).toISOString() : null,
    fetchedAt: new Date().toISOString(),
  };
}
