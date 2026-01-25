import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectMongo } from "./config/mongo.js";
import adminRoutes from "./routes/admin.js";
import articlesRoutes from "./routes/articles.js";
import { startScheduler } from "./jobs/refreshScheduler.js";
import Article from "./models/Article.js";
import { refreshAllSources } from "./services/refreshAllSources.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/admin", adminRoutes);
app.use("/api/articles", articlesRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "sucess", message: "Backend is running" });
});

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await connectMongo();

    const existingArticles = await Article.countDocuments({});
    if (existingArticles === 0) {
      await refreshAllSources(); 
    }

    startScheduler();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Startup failed:", err.message);
    process.exit(1);
  }
}

start();