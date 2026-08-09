#!/usr/bin/env node
/**
 * Daily post generator.
 *
 * 1. Pulls recent items from HighLevel's blog / changelog RSS feed(s).
 * 2. Filters out items already used (tracked in scripts/used_sources.json).
 * 3. Asks Gemini to pick the most blog-worthy item, an angle, and write the post.
 * 4. Picks the best-fit affiliate link tag from _data/affiliate_links.yml.
 * 5. Fetches a licensed cover image from Unsplash.
 * 6. Writes a new file into _posts/, ready to be opened as a PR by the workflow.
 *
 * Required env vars (set as GitHub Actions secrets):
 *   GEMINI_API_KEY
 *   UNSPLASH_ACCESS_KEY   (optional - falls back to no image if missing)
 *
 * NOTE: This script intentionally does NOT auto-publish. It only writes a file.
 * The GitHub Actions workflow opens that file as a Pull Request for review.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const POSTS_DIR = path.join(ROOT, "_posts");
const USED_SOURCES_PATH = path.join(__dirname, "used_sources.json");
const AFFILIATE_LINKS_PATH = path.join(ROOT, "_data", "affiliate_links.yml");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

// HighLevel's own feeds. Add/remove as you confirm which ones are live.
const FEEDS = [
  "https://www.gohighlevel.com/blog/rss.xml",
  "https://ideas.gohighlevel.com/feed", // may not exist; script skips failures
];

async function main() {
  if (!GEMINI_API_KEY) {
    console.error("Missing GEMINI_API_KEY, aborting.");
    process.exit(1);
  }

  const items = await fetchAllFeeds(FEEDS);
  if (items.length === 0) {
    console.log("No feed items found. Exiting without creating a post.");
    return;
  }

  const usedUrls = loadUsedSources();
  const freshItems = items.filter((item) => !usedUrls.includes(item.link));

  if (freshItems.length === 0) {
    console.log("No unused items available. Exiting without creating a post.");
    return;
  }

  const affiliateLinkTags = Object.keys(parseYamlKeys(AFFILIATE_LINKS_PATH));

  const draft = await draftPostWithGemini(freshItems.slice(0, 10), affiliateLinkTags);
  if (!draft) {
    console.log("Gemini did not return a usable draft. Exiting.");
    return;
  }

  const imagePath = UNSPLASH_ACCESS_KEY
    ? await fetchAndSaveImage(draft.image_query, draft.slug)
    : null;

  writePostFile(draft, imagePath);
  markSourceUsed(draft.source_url, usedUrls);

  console.log(`Draft created: ${draft.slug}`);
}

// ---------- Feed fetching ----------

async function fetchAllFeeds(urls) {
  const results = [];
  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const xml = await res.text();
      results.push(...parseRssItems(xml));
    } catch (err) {
      console.warn(`Feed fetch failed for ${url}: ${err.message}`);
    }
  }
  return results;
}

function parseRssItems(xml) {
  const items = [];
  const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];
  for (const raw of itemMatches) {
    const title = extractTag(raw, "title");
    const link = extractTag(raw, "link");
    const pubDate = extractTag(raw, "pubDate");
    const description = extractTag(raw, "description");
    if (title && link) {
      items.push({ title, link, pubDate, description });
    }
  }
  return items;
}

function extractTag(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
  if (!match) return null;
  return match[1]
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")
    .replace(/<[^>]+>/g, "")
    .trim();
}

// ---------- Used-source tracking ----------

function loadUsedSources() {
  if (!fs.existsSync(USED_SOURCES_PATH)) return [];
  try {
    return JSON.parse(fs.readFileSync(USED_SOURCES_PATH, "utf8"));
  } catch {
    return [];
  }
}

function markSourceUsed(url, existing) {
  const updated = [...existing, url].slice(-200); // keep last 200
  fs.writeFileSync(USED_SOURCES_PATH, JSON.stringify(updated, null, 2));
}

// ---------- Affiliate link tags (lightweight YAML key parse, no dependency) ----------

function parseYamlKeys(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const keys = {};
  for (const line of raw.split("\n")) {
    const match = line.match(/^([a-z_]+):\s*$/);
    if (match) keys[match[1]] = true;
  }
  return keys;
}

// ---------- Gemini drafting ----------

async function draftPostWithGemini(items, affiliateLinkTags) {
  const prompt = buildPrompt(items, affiliateLinkTags);

  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" },
      }),
    }
  );

  if (!res.ok) {
    console.error("Gemini request failed:", await res.text());
    return null;
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return null;

  try {
    const parsed = JSON.parse(text);
    return normalizeDraft(parsed);
  } catch (err) {
    console.error("Failed to parse Gemini JSON output:", err.message);
    return null;
  }
}

function buildPrompt(items, affiliateLinkTags) {
  const itemsList = items
    .map((it, i) => `${i + 1}. ${it.title}\n   URL: ${it.link}\n   Summary: ${it.description || "(none)"}`)
    .join("\n\n");

  return `You are writing for affiliatealfa, an independent blog that covers HighLevel CRM
updates for marketing agencies. The tone is direct, specific, and useful, never hypey
marketing copy. You write in your own words; you never copy phrasing from the source.

Here are recent items from HighLevel's own blog/changelog:

${itemsList}

Pick the ONE item most worth a blog post today (most useful or interesting to an agency
owner). Write a full post about it, in your own words, adding real independent value:
a concrete use case, a practical implication, or a comparison, not just a rewording of
the source.

Available affiliate link tags (pick the single best fit): ${affiliateLinkTags.join(", ")}

Respond with ONLY valid JSON, no markdown fences, in this exact shape:
{
  "title": "string, under 70 characters",
  "slug": "url-safe-slug-no-spaces",
  "source_url": "the URL of the item you picked",
  "affiliate_link_tag": "one of the provided tags",
  "cta_text": "one short sentence for the CTA button context",
  "image_query": "2-4 word search query for a relevant stock photo, no brand names",
  "body_markdown": "the full post body in markdown, 400-700 words, no title heading (title is separate)"
}`;
}

function normalizeDraft(parsed) {
  const required = ["title", "slug", "source_url", "affiliate_link_tag", "body_markdown"];
  for (const key of required) {
    if (!parsed[key]) {
      console.error(`Gemini draft missing required field: ${key}`);
      return null;
    }
  }
  parsed.slug = parsed.slug
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return parsed;
}

// ---------- Image sourcing (Unsplash, licensed) ----------

async function fetchAndSaveImage(query, slug) {
  try {
    const res = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const imageUrl = data?.urls?.regular;
    if (!imageUrl) return null;

    const imgRes = await fetch(imageUrl);
    const buffer = Buffer.from(await imgRes.arrayBuffer());
    const filename = `${slug}.jpg`;
    const outPath = path.join(ROOT, "assets", "images", filename);
    fs.writeFileSync(outPath, buffer);
    return `/assets/images/${filename}`;
  } catch (err) {
    console.warn("Image fetch failed:", err.message);
    return null;
  }
}

// ---------- Write the post file ----------

function writePostFile(draft, imagePath) {
  const dateStr = new Date().toISOString().slice(0, 10);
  const filename = `${dateStr}-${draft.slug}.md`;
  const filePath = path.join(POSTS_DIR, filename);

  const frontMatter = [
    "---",
    `title: ${JSON.stringify(draft.title)}`,
    `date: ${dateStr}`,
    `source_url: ${JSON.stringify(draft.source_url)}`,
    `affiliate_link: ${draft.affiliate_link_tag}`,
    draft.cta_text ? `cta_text: ${JSON.stringify(draft.cta_text)}` : null,
    imagePath ? `image: ${imagePath}` : null,
    "---",
  ]
    .filter(Boolean)
    .join("\n");

  fs.writeFileSync(filePath, `${frontMatter}\n\n${draft.body_markdown}\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
