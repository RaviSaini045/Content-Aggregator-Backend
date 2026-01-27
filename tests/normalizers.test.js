import { normalizeReddit } from "../src/services/normalizers/normalizeReddit.js";

describe("normalizeReddit", () => {
  test("returns unified schema with UTC publishedAt", () => {
    const input = {
      id: "abc123",
      title: "Hello",
      url: "https://example.com",
      author: "ravi-saini",
      created_utc: 1700000000,
    };

    const out = normalizeReddit(input);

    expect(out).toEqual(
      expect.objectContaining({
        id: "reddit-abc123",
        title: "Hello",
        url: "https://example.com",
        author: "ravi-saini",
        source: "reddit",
      })
    );

    expect(new Date(out.publishedAt).toISOString()).toBe(out.publishedAt);
  });
});
