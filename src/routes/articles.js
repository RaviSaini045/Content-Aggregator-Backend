import { Router } from "express";
import Article from "../models/Article.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const source = req.query.source ? String(req.query.source).toLowerCase() : null;

    if (page < 1 || limit < 1 || limit > 50) {
      return res.status(400).json({
        success: false,
        message: "invalid page or limit",
      });
    }

    const filter = {};
    // ex { source: "reddit" }
    if (source) {
      filter.source = source;
    }

    const skip = (page - 1) * limit;

    const [articles, totalCount] = await Promise.all([
      Article.find(filter)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Article.countDocuments(filter),
    ]);

    res.json({
      success: true,
      page,
      limit,
      totalCount,
      articles,
    });
  } catch (error) {
    console.error("fetch articles error:", error);
    res.status(500).json({
      success: false,
      message: "failed to fetch articles",
    });
  }
});

export default router;
