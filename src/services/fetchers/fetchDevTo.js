import axios from "axios";
import { normalizeDevTo } from "../normalizers/normalizeDevTo.js";

export async function fetchDevTo() {
  const baseUrl = process.env.DEVTO_BASE_URL || "https://dev.to/api";

  const res = await axios.get(`${baseUrl}/articles`, {
    params: { per_page:10, page: 1 },
    headers: { "User-Agent": "content-aggregator-backend" },
  });

  const articles = Array.isArray(res.data) ? res.data : [];

  return articles.map((item) => { return normalizeDevTo(item);});
}
