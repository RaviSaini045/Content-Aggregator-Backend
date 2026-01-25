// 1) Normalized articles ki list lena
// 2) MongoDB me insert / update karna
// 3) Duplicate articles ko avoid karna using (source + externalId)

import Article from "../models/Article.js";

export async function upsertArticles(normalizedArticles) {
  if (!Array.isArray(normalizedArticles) || normalizedArticles.length === 0) {
    return { insertedOrUpdated: 0 };
  }

  // Normalized data ko DB schema ke format me convert kar rahe hain
  const rows = normalizedArticles
    .filter((a) => a && a.source && a.id)

    .map((a) => {
      const externalId =
        String(a.id).split("-").slice(1).join("-") || String(a.id);

      return {
        title: a.title,

        url: a.url,

        author: a.author ?? null,

        source: a.source,

        externalId,

        publishedAt: a.publishedAt ? new Date(a.publishedAt) : null,

        fetchedAt: a.fetchedAt ? new Date(a.fetchedAt) : new Date(),
      };
    })

    .filter(
      (r) =>
        r.title &&
        r.url &&
        r.source &&
        r.externalId &&
        r.publishedAt
    );

  if (rows.length === 0) {
    return { insertedOrUpdated: 0 };
  }

  const operations = rows.map((row) => ({
    updateOne: {
      filter: { source: row.source, externalId: row.externalId },

      update: { $set: row },

      upsert: true,
    },
  }));

  const result = await Article.bulkWrite(operations, { ordered: false });

  const insertedOrUpdated =
    (result.upsertedCount || 0) + (result.modifiedCount || 0);

  return { insertedOrUpdated };
}
