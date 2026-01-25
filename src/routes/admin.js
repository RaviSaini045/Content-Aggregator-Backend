import { Router } from "express";

const router = Router();

router.post("/refresh", async (req, res) => {
  return res.status(501).json({
    success: false,
    message: "refresh not implemented yet",
  });
});

export default router;
