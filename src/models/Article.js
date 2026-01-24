import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    author: { type: String, default: null },
    source: { type: String, required: true },
    externalId: { type: String, required: true },
    publishedAt: { type: Date, required: true },
    fetchedAt: { type: Date, required: true }, 
  },
  {
    timestamps: false,
  }
);

ArticleSchema.index({ source: 1, externalId: 1 }, { unique: true });

const Article = mongoose.model("Article", ArticleSchema);

export default Article;
