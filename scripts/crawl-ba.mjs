/**
 * Naver Blog Before/After → Sanity Migration
 *
 * Crawls implant before/after posts from Naver blog (yonseicholee)
 * category 16 and creates Sanity `post` documents with images.
 *
 * Usage:
 *   node scripts/crawl-ba.mjs
 *
 * Requires: SANITY_API_TOKEN, NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local
 */

import { createClient } from "@sanity/client";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ===== Load .env.local (same as migrate.mjs) =====
const envPath = join(__dirname, "..", ".env.local");
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN in .env.local"
  );
  process.exit(1);
}

const sanityClient = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false,
});

// ===== Constants =====
const BLOG_ID = "yonseicholee";
const CATEGORY_NO = 16;
const AUTHOR = "이승범 대표원장";
const CATEGORY = "implant";

// Notice/promo posts to exclude (repeated on every page)
const EXCLUDED_LOG_NOS = new Set([
  "222413842397",
  "222366292098",
  "220874727470",
]);

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
  Referer: `https://blog.naver.com/${BLOG_ID}`,
};

// ===== Fetch post list from Naver API =====
async function getPostList() {
  const url =
    `https://blog.naver.com/PostTitleListAsync.naver?` +
    `blogId=${BLOG_ID}&viewdate=&currentPage=1` +
    `&categoryNo=${CATEGORY_NO}&parentCategoryNo=&countPerPage=30`;

  const resp = await fetch(url, {
    headers: {
      ...HEADERS,
      Accept: "application/json, text/javascript, */*",
    },
  });
  let text = await resp.text();

  // Fix invalid JSON escapes (Naver returns \' which is invalid JSON)
  text = text.replaceAll("\\'", "'");

  const data = JSON.parse(text);
  const posts = data.postList || [];

  // Decode URL-encoded titles and filter out notices
  return posts
    .filter((p) => !EXCLUDED_LOG_NOS.has(String(p.logNo)))
    .map((p) => ({
      logNo: String(p.logNo),
      title: decodeURIComponent((p.title || "").replace(/\+/g, " ")),
      addDate: p.addDate || "",
    }));
}

// ===== Parse Naver date string ("2014. 2. 9.") to ISO =====
function parseNaverDate(dateStr) {
  const cleaned = dateStr.replace(/\s+/g, "").replace(/\.$/, "");
  const parts = cleaned.split(".");
  if (parts.length === 3) {
    const [y, m, d] = parts.map(Number);
    return new Date(y, m - 1, d).toISOString();
  }
  return new Date().toISOString();
}

// ===== Download image and upload to Sanity =====
async function uploadImageFromUrl(url) {
  try {
    const resp = await fetch(url, {
      headers: {
        ...HEADERS,
        Accept: "image/webp,image/apng,image/*,*/*;q=0.8",
      },
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

    const buffer = Buffer.from(await resp.arrayBuffer());
    if (buffer.length === 0) throw new Error("Empty image");

    // Determine content type from URL
    const urlPath = url.split("?")[0].toLowerCase();
    let contentType = "image/jpeg";
    if (urlPath.endsWith(".png")) contentType = "image/png";
    else if (urlPath.endsWith(".gif")) contentType = "image/gif";
    else if (urlPath.endsWith(".webp")) contentType = "image/webp";

    // Extract filename from URL (some have EUC-KR encoding, so fallback gracefully)
    let filename;
    try {
      filename = decodeURIComponent(
        url.split("?")[0].split("/").pop() || "image.jpg"
      );
    } catch {
      filename = url.split("?")[0].split("/").pop() || "image.jpg";
    }

    const asset = await sanityClient.assets.upload("image", buffer, {
      filename,
      contentType,
    });

    return asset._id;
  } catch (err) {
    console.error(`    Failed to upload image: ${err.message}`);
    return null;
  }
}

// ===== Build PortableText preserving document order =====
function buildPortableTextOrdered(contentHtml, imageAssetIds) {
  const blocks = [];
  let blockKey = 0;
  let imgIdx = 0;

  // Walk through <p> tags in order; when an img appears, insert the image block
  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let match;

  while ((match = pRegex.exec(contentHtml)) !== null) {
    const inner = match[1];

    // Count images in this <p>
    const imgCount = (inner.match(/data-lazy-src="/g) || []).length;

    // Extract text (strip tags)
    const text = inner
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<img[^>]*>/gi, "")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .trim();

    if (text) {
      blocks.push({
        _type: "block",
        _key: `block-${blockKey++}`,
        style: "normal",
        markDefs: [],
        children: [
          { _type: "span", _key: `span-${blockKey}`, text, marks: [] },
        ],
      });
    }

    // Insert images that appeared in this <p>
    for (let i = 0; i < imgCount; i++) {
      if (imgIdx < imageAssetIds.length && imageAssetIds[imgIdx]) {
        blocks.push({
          _type: "image",
          _key: `block-${blockKey++}`,
          asset: { _type: "reference", _ref: imageAssetIds[imgIdx] },
        });
      }
      imgIdx++;
    }
  }

  // Append any remaining images not yet inserted
  while (imgIdx < imageAssetIds.length) {
    if (imageAssetIds[imgIdx]) {
      blocks.push({
        _type: "image",
        _key: `block-${blockKey++}`,
        asset: { _type: "reference", _ref: imageAssetIds[imgIdx] },
      });
    }
    imgIdx++;
  }

  if (blocks.length === 0) {
    blocks.push({
      _type: "block",
      _key: "block-empty",
      style: "normal",
      markDefs: [],
      children: [
        { _type: "span", _key: "span-empty", text: "", marks: [] },
      ],
    });
  }

  return blocks;
}

// ===== Fetch raw content HTML for ordered parsing =====
async function fetchPostContentRaw(logNo) {
  const url =
    `https://blog.naver.com/PostView.naver?` +
    `blogId=${BLOG_ID}&logNo=${logNo}&redirect=Dlog&widgetTypeCall=true`;

  const resp = await fetch(url, { headers: HEADERS });
  const html = await resp.text();

  const viewId = `post-view${logNo}`;
  const startIdx = html.indexOf(`id="${viewId}"`);
  if (startIdx === -1) return null;

  const viewStart = html.indexOf('class="view">', startIdx);
  if (viewStart === -1) return null;

  const contentStart = viewStart + 'class="view">'.length;

  let depth = 1;
  let pos = contentStart;
  while (depth > 0 && pos < html.length) {
    const nextOpen = html.indexOf("<div", pos);
    const nextClose = html.indexOf("</div>", pos);
    if (nextClose === -1) break;
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      pos = nextOpen + 4;
    } else {
      depth--;
      if (depth === 0) {
        pos = nextClose;
        break;
      }
      pos = nextClose + 6;
    }
  }

  const contentHtml = html.slice(contentStart, pos);

  // Extract image URLs in order
  const imageUrls = [];
  const imgRegex = /data-lazy-src="([^"]+)"/g;
  let match;
  while ((match = imgRegex.exec(contentHtml)) !== null) {
    let src = match[1];
    src = src.replace(/\?type=\w+/, "?type=w773");
    imageUrls.push(src);
  }

  return { contentHtml, imageUrls };
}

// ===== Main =====
async function main() {
  console.log("=== Naver Blog Before/After → Sanity Migration ===");
  console.log(`Project: ${projectId}, Dataset: ${dataset}`);
  console.log();

  // 1. Fetch post list
  console.log("Fetching post list from category 16...");
  const posts = await getPostList();
  console.log(`Found ${posts.length} posts (excluding notices)\n`);

  let created = 0;
  let failed = 0;

  for (let i = 0; i < posts.length; i++) {
    const { logNo, title, addDate } = posts[i];
    console.log(`[${i + 1}/${posts.length}] ${title}`);
    console.log(`  logNo: ${logNo}, date: ${addDate}`);

    try {
      // 2. Fetch post HTML
      const raw = await fetchPostContentRaw(logNo);
      if (!raw) {
        console.error("  Failed to fetch post content");
        failed++;
        continue;
      }

      const { contentHtml, imageUrls } = raw;
      console.log(
        `  Found ${imageUrls.length} images`
      );

      // 3. Upload images to Sanity
      const imageAssetIds = [];
      for (let j = 0; j < imageUrls.length; j++) {
        console.log(
          `  Uploading image ${j + 1}/${imageUrls.length}...`
        );
        const assetId = await uploadImageFromUrl(imageUrls[j]);
        imageAssetIds.push(assetId);
        if (assetId) {
          console.log(`    → ${assetId}`);
        }
        // Rate limit
        await new Promise((r) => setTimeout(r, 300));
      }

      // 4. Build PortableText body preserving document order
      const body = buildPortableTextOrdered(contentHtml, imageAssetIds);

      // 5. Create Sanity post document
      const firstImageAssetId = imageAssetIds.find((id) => id != null);
      const doc = {
        _id: `post-ba-${logNo}`,
        _type: "post",
        title,
        slug: { _type: "slug", current: `ba-${logNo}` },
        date: parseNaverDate(addDate),
        category: CATEGORY,
        author: AUTHOR,
        body,
        ...(firstImageAssetId && {
          thumbnail: {
            _type: "image",
            asset: { _type: "reference", _ref: firstImageAssetId },
          },
        }),
      };

      await sanityClient.createOrReplace(doc);
      console.log(`  ✓ Post created: post-ba-${logNo}\n`);
      created++;

      // Rate limit between posts
      await new Promise((r) => setTimeout(r, 500));
    } catch (err) {
      console.error(`  ✗ Failed: ${err.message}\n`);
      failed++;
    }
  }

  console.log("=== Migration Complete ===");
  console.log(`  Created: ${created}`);
  console.log(`  Failed:  ${failed}`);
  console.log(`  Total:   ${posts.length}`);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
