// src/services/fetchers/fetchHackerNews.js

import axios from "axios";
import { normalizeHackerNews } from "../normalizers/normalizeHackerNews.js";

export async function fetchHackerNews() {
  const baseUrl = process.env.HN_BASE_URL || "https://hacker-news.firebaseio.com";

  const idsRes = await axios.get(`${baseUrl}/v0/topstories.json`, {
    headers: { "User-Agent": "content-aggregator-backend" },
  });

  const topIds = Array.isArray(idsRes.data) ? idsRes.data.slice(0, 10) : [];

  const itemPromises = topIds.map((id) =>
    axios
      .get(`${baseUrl}/v0/item/${id}.json`, {
        headers: { "User-Agent": "content-aggregator-backend" },
      })
      .then((r) => r.data)
      .catch(() => null) 
  );

  const items = await Promise.all(itemPromises);

  const cleaned = items.filter((it) => it && it.title);

  return cleaned.map((item)=>{return normalizeHackerNews(item)});
}
