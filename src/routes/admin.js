import { Router } from "express";
import { manualRefreshAndReset } from "../jobs/refreshScheduler.js";
import Article from "../models/Article.js";
import { canRefreshNow } from "../services/refreshGuard.js";

const router = Router();

router.post("/refresh", async (req, res) => {
  try {

    const existing = await Article.countDocuments({});
    const isDbEmpty = existing === 0;

    const cooldownMs = 30 * 1000; // 30 seconds
    if (!isDbEmpty && !canRefreshNow(cooldownMs)) {
      return res.json({
        success: true,
        skipped: true,
        reason: "cooldown",
        message: "Refresh skipped due to cooldown",
      });
    }

    const result = await manualRefreshAndReset();

    res.json({
      success: true,
      message: "Sources refreshed successfully, timer reset",
      data: result,
    });
  } catch (error) {
    console.error("Manual refresh error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to refresh sources",
      error: error.message,
    });
  }
});

export default router;
