# Content Aggregator Backend

Backend service that aggregates articles from Hacker News, Dev.to, and Reddit, normalizes them, and stores them in MongoDB. It exposes a simple API for listing articles and triggering refreshes, plus a background scheduler for periodic updates.

## Live Links
**Frontend:** [Live](https://content-aggregator-frontend-gamma.vercel.app/)  
**Backend:** [Live](https://content-aggregator-backend-run2.onrender.com)

## Features
- Aggregates top/new articles from Hacker News, Dev.to, and Reddit
- Normalizes data into a single MongoDB schema and upserts by source + externalId
- Scheduled background refresh with a configurable interval
- Manual refresh endpoint with cooldown protection
- Paginated articles API
- Health check endpoint

## Setup and Installation
1) Install dependencies:
```bash
npm install
```

2) Create a `.env` file in the project root (see Environment Variables below).

3) Ensure MongoDB is running and the `MONGO_URI` points to it.

## Environment Variables
Required:
- `MONGO_URI` - MongoDB connection string

Optional:
- `PORT` - Server port (default: `4000`)
- `REFRESH_INTERVAL_MINUTES` - Background refresh interval in minutes (default: `5`)
- `HN_BASE_URL` - Hacker News API base URL (default: `https://hacker-news.firebaseio.com`)
- `DEVTO_BASE_URL` - Dev.to API base URL (default: `https://dev.to/api`)
- `REDDIT_BASE_URL` - Reddit base URL (default: `https://www.reddit.com`)

Example `.env`:
```bash
MONGO_URI=mongodb://localhost:27017/content-aggregator
PORT=4000
REFRESH_INTERVAL_MINUTES=15
```

## Run Locally
Start the server:
```bash
npm run dev
```

On startup the app:
- Connects to MongoDB.
- Performs an initial refresh if the database has no articles.
- Starts the background refresh scheduler.

### Trigger/Verify Background Jobs
The scheduler runs every `REFRESH_INTERVAL_MINUTES`. To force a refresh:
```bash
curl -X POST http://localhost:4000/admin/refresh
```

The response includes `data` with per-source results and `fetchedAt`. If you call this endpoint repeatedly, it uses a 30-second cooldown when the database is not empty.

To verify the job inserted data, list recent articles:
```bash
curl "http://localhost:4000/api/articles?page=1&limit=10"
```

## API Endpoints

### GET `/health`
Returns service status.

Response:
```json
{
  "status": "sucess",
  "message": "Backend is running"
}
```

### GET `/api/articles`
List articles with pagination and optional source filter.

Query params:
- `page` (number, default `1`)
- `limit` (number, default `10`, max `50`)

Response:
```json
{
  "success": true,
  "page": 1,
  "limit": 10,
  "totalCount": 123,
  "articles": [
    {
      "_id": "...",
      "title": "...",
      "url": "...",
      "author": "...",
      "source": "hackernews",
      "externalId": "123",
      "publishedAt": "2024-01-01T00:00:00.000Z",
      "fetchedAt": "2024-01-01T00:05:00.000Z"
    }
  ]
}
```

Errors:
- `400` for invalid `page` or `limit`
- `500` on server error

### POST `/admin/refresh`
Manually refresh all sources and reset the scheduler timer.

Response:
```json
{
  "success": true,
  "message": "Sources refreshed successfully, timer reset",
  "data": {
    "hackernews": { "success": true, "articleFetchedCount": 10, "error": null },
    "devto": { "success": true, "articleFetchedCount": 10, "error": null },
    "reddit": { "success": true, "articleFetchedCount": 10, "error": null },
    "totalArticleFetched": 25,
    "fetchedAt": "2024-01-01T00:05:00.000Z"
  }
}
```

If cooldown is active, the endpoint returns:
```json
{
  "success": true,
  "skipped": true,
  "reason": "cooldown",
  "message": "Refresh skipped due to cooldown"
}
```

## Design Decisions
### Technologies and Patterns
- **Node.js + Express**: Simple HTTP layer with minimal boilerplate and easy middleware support.
- **MongoDB + Mongoose**: Flexible schema for heterogeneous sources and convenient upserts via `bulkWrite`.

### Trade-offs Considered
- **Top-N fetch strategy**: Fast and predictable, but may miss older items beyond the top 10.
- **No auth on admin endpoint**: Easier testing, but not safe for production.

### Improvements With More Time
- Add caching to reduce fetch load.
- Improve logging and observability (structured logs, metrics).
- Expand tests for fetchers and scheduling behavior.
