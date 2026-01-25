import axios from "axios";
import { normalizeReddit } from "../normalizers/normalizeReddit.js";

export async function fetchReddit() {
  const baseUrl = process.env.REDDIT_BASE_URL || "https://www.reddit.com";

  const res = await axios.get(`${baseUrl}/r/all/new.json`, {
    params: { limit: 20 },
    headers: { "User-Agent": "content-aggregator-backend" },
  });

  const children = res.data?.data?.children;
  const posts = Array.isArray(children) ? children.map((c) => c.data).filter(Boolean) : [];

  return posts.map((item)=>{return normalizeReddit(item);});
}
