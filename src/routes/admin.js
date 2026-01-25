import { Router } from "express";
import { manualRefreshAndReset } from "../jobs/refreshScheduler.js";

const router = Router();

router.post("/refresh", async (req, res) => {
  try {
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
