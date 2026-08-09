#!/usr/bin/env node
/**
 * Daily post generator.
 *
 * 1. Pulls recent items from HighLevel's blog / changelog RSS feed(s).
 * 2. Filters out items already used (tracked in scripts/used_sources.json).
 * 3. Asks Gemini to pick the most blog-worthy item, an angle, and write the post.
 * 4. Picks the best-fit affiliate link tag from _data/affiliate_links.yml.
 * 5. Sources a cover image: real image from HighLevel's own post/changelog first,
 *    then a licensed Unsplash photo, then a simple generated graphic as last resort.
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

  const imagePath = await sourceImage(draft, freshItems);

  writePostFile(draft, imagePath);
  markSourceUsed(draft.source_url, usedUrls);

  console.log(`Draft created: ${draft.slug}`);
}

/**
 * Image priority order:
 *   1. A real image already embedded in the source RSS item (HighLevel's own
 *      featured image / content image) - most credible, actually from HighLevel.
 *   2. The og:image / twitter:image meta tag on the source article's own page,
 *      fetched directly - also a real HighLevel-provided image.
 *   3. A licensed Unsplash photo matching the topic, only if neither real
 *      image was found and UNSPLASH_ACCESS_KEY is set.
 *   4. A simple generated graphic (no network dependency) as a last resort,
 *      so a post is never left with a broken or missing image.
 */
async function sourceImage(draft, freshItems) {
  const sourceItem = freshItems.find((it) => it.link === draft.source_url);

  const embedded = sourceItem ? extractImageFromItem(sourceItem) : null;
  if (embedded) {
    const saved = await downloadImage(embedded, draft.slug);
    if (saved) {
      console.log("Using real image embedded in the source item.");
      return saved;
    }
  }

  const ogImage = await extractOgImage(draft.source_url);
  if (ogImage) {
    const saved = await downloadImage(ogImage, draft.slug);
    if (saved) {
      console.log("Using real og:image from the source article.");
      return saved;
    }
  }

  if (UNSPLASH_ACCESS_KEY) {
    const unsplash = await fetchAndSaveImage(draft.image_query, draft.slug);
    if (unsplash) {
      console.log("No real HighLevel image found, using a licensed Unsplash photo.");
      return unsplash;
    }
  }

  console.log("No real image or Unsplash key available, generating a simple graphic instead.");
  return generateFallbackImage(draft.title, draft.slug);
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
    // content:encoded often carries the full post body with the real
    // featured image inline, even when description is a short summary.
    const contentEncodedMatch = raw.match(/<content:encoded>([\s\S]*?)<\/content:encoded>/);
    const contentEncoded = contentEncodedMatch ? contentEncodedMatch[1] : null;
    if (title && link) {
      items.push({ title, link, pubDate, description, contentEncoded });
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
    return await downloadImage(imageUrl, slug);
  } catch (err) {
    console.warn("Unsplash fetch failed:", err.message);
    return null;
  }
}

// ---------- Real image extraction (HighLevel's own images, preferred) ----------

// Looks for the first <img src="..."> inside the RSS item's own content,
// which for HighLevel's blog/changelog is usually the actual featured image
// HighLevel itself published with the post.
function extractImageFromItem(item) {
  const haystacks = [item.contentEncoded, item.description].filter(Boolean);
  for (const html of haystacks) {
    const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (match && match[1] && looksLikeRealImageUrl(match[1])) {
      return match[1];
    }
  }
  return null;
}

// Fetches the source article's own page and reads its og:image / twitter:image
// meta tag - this is the image HighLevel itself chose to represent that post.
async function extractOgImage(pageUrl) {
  try {
    const res = await fetch(pageUrl);
    if (!res.ok) return null;
    const html = await res.text();
    const og = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    if (og && og[1] && looksLikeRealImageUrl(og[1])) return og[1];

    const twitter = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i);
    if (twitter && twitter[1] && looksLikeRealImageUrl(twitter[1])) return twitter[1];

    return null;
  } catch (err) {
    console.warn("og:image fetch failed:", err.message);
    return null;
  }
}

// Filters out obvious tracking pixels, spacer gifs, and tiny icons so we
// don't end up "sourcing" a 1x1 transparent gif as the post's hero image.
function looksLikeRealImageUrl(url) {
  const lower = url.toLowerCase();
  if (lower.includes("pixel") || lower.includes("spacer") || lower.includes("tracking")) return false;
  if (lower.endsWith(".gif")) return false;
  return /\.(jpe?g|png|webp)(\?|$)/.test(lower) || lower.includes("cdn") || lower.includes("image");
}

// Generic downloader used by both the real-image path and the Unsplash path.
async function downloadImage(imageUrl, slug) {
  try {
    const imgRes = await fetch(imageUrl);
    if (!imgRes.ok) return null;
    const buffer = Buffer.from(await imgRes.arrayBuffer());
    const contentType = imgRes.headers.get("content-type") || "";
    const ext = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
    const filename = `${slug}.${ext}`;
    const outPath = path.join(ROOT, "assets", "images", filename);
    fs.writeFileSync(outPath, buffer);
    return `/assets/images/${filename}`;
  } catch (err) {
    console.warn("Image download failed:", err.message);
    return null;
  }
}

// ---------- Last-resort fallback: a simple generated graphic, no network needed ----------
// Only used when no real HighLevel image and no Unsplash key/result are available,
// so a post is never left with a missing or broken image.
function generateFallbackImage(title, slug) {
  const escapedTitle = title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const svg = `<svg viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0A0F2C"/>
      <stop offset="100%" stop-color="#12183F"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2E5BFF"/>
      <stop offset="100%" stop-color="#8B3EFF"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="80" y="80" width="64" height="6" rx="3" fill="url(#accent)"/>
  <foreignObject x="80" y="120" width="1040" height="400">
    <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: Arial, sans-serif; color: #FFFFFF; font-size: 44px; font-weight: 700; line-height: 1.25;">
      ${escapedTitle}
    </div>
  </foreignObject>
  <text x="80" y="560" font-family="Arial, sans-serif" font-size="20" fill="#9FB0FF" letter-spacing="2">AFFILIATEALFA · HIGHLEVEL COVERAGE</text>
</svg>`;

  const filename = `${slug}.svg`;
  const outPath = path.join(ROOT, "assets", "images", filename);
  fs.writeFileSync(outPath, svg);
  return `/assets/images/${filename}`;
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
