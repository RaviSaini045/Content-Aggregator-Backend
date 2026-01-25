import { fetchHackerNews } from "./fetchers/fetchHackerNews.js";
import { fetchDevTo } from "./fetchers/fetchDevTo.js";
import { fetchReddit } from "./fetchers/fetchReddit.js";
import { upsertArticles } from "./articleStore.js";

export async function refreshAllSources() {
  const results = {
    hackernews: { success: false, articleFetchedCount: 0, error: null },
    devto: { success: false, articleFetchedCount: 0, error: null },
    reddit: { success: false, articleFetchedCount: 0, error: null },
    totalArticleFetched: 0,
    fetchedAt: new Date().toISOString(),
  };

  async function runSource(name, fn) {
    try {
      const normalizedArticles = await fn();
      const saveRes = await upsertArticles(normalizedArticles);
      results[name].success = true;
      results[name].articleFetchedCount = normalizedArticles.length;
      results.totalArticleFetched += saveRes.insertedOrUpdated;
    } catch (err) {
      results[name].success = false;
      results[name].error = err?.message || String(err);
    }
  }

  await Promise.all([
    runSource("hackernews", fetchHackerNews),
    runSource("devto", fetchDevTo),
    runSource("reddit", fetchReddit),
  ]);

  return results;
}
