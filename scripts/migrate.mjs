/**
 * Migration Script: Jekyll → Sanity
 *
 * Usage:
 *   1. Set SANITY_API_TOKEN, NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET in .env.local
 *   2. Run: node scripts/migrate.mjs
 *
 * What it does:
 *   - Reads _data/*.yml from the Jekyll site
 *   - Creates Sanity documents for siteSettings, doctors, hours, heroSlides
 *   - Reads _posts/*.md and creates Sanity post documents
 *   - Uploads images from assets/images/ to Sanity CDN
 */

import { createClient } from "@sanity/client";
import { readFileSync, readdirSync, existsSync } from "fs";
import { join, basename, extname } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local
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
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN in .env.local");
  process.exit(1);
}

const sanityClient = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false,
});

const JEKYLL_ROOT = join(__dirname, "..", "..", "ws.sbhome");

// ===== YAML parser (simple) =====
function parseSimpleYaml(content) {
  // Simple YAML parser for flat, array, and one-level nested array structures
  const lines = content.split("\n");
  const result = {};
  let currentArray = null;
  let currentArrayName = null;
  let currentObj = null;
  let parentArrayIndent = -1;
  let subArrayKey = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const indent = line.length - line.trimStart().length;

    // Top-level key: value
    if (indent === 0 && trimmed.includes(":")) {
      const colonIndex = trimmed.indexOf(":");
      const key = trimmed.slice(0, colonIndex).trim();
      const value = trimmed.slice(colonIndex + 1).trim();

      if (!value) {
        // Could be start of an array or nested object
        currentArrayName = key;
        currentArray = [];
        result[key] = currentArray;
        currentObj = null;
        parentArrayIndent = -1;
        subArrayKey = null;
      } else {
        result[key] = value.replace(/^["']|["']$/g, "");
        currentArray = null;
        currentArrayName = null;
      }
    } else if (subArrayKey && currentObj && trimmed.startsWith("- ") && indent > parentArrayIndent) {
      // Nested sub-array item (e.g., specialties entries within a doctor)
      const after = trimmed.slice(2).trim();
      if (after.includes(":")) {
        const colonIndex = after.indexOf(":");
        const value = after.slice(colonIndex + 1).trim().replace(/^["']|["']$/g, "");
        currentObj[subArrayKey].push(value);
      } else {
        currentObj[subArrayKey].push(after.replace(/^["']|["']$/g, ""));
      }
    } else if (currentArray !== null && trimmed.startsWith("- ")) {
      // Parent array item or start of object in array
      subArrayKey = null;
      if (parentArrayIndent === -1) parentArrayIndent = indent;
      const after = trimmed.slice(2).trim();
      if (after.includes(":")) {
        // Object start
        currentObj = {};
        currentArray.push(currentObj);
        const colonIndex = after.indexOf(":");
        const key = after.slice(0, colonIndex).trim();
        const value = after.slice(colonIndex + 1).trim().replace(/^["']|["']$/g, "");
        currentObj[key] = value === "true" ? true : value === "false" ? false : value;
      } else {
        currentArray.push(after.replace(/^["']|["']$/g, ""));
      }
    } else if (currentObj !== null && indent >= 2 && trimmed.includes(":")) {
      const colonIndex = trimmed.indexOf(":");
      const key = trimmed.slice(0, colonIndex).trim();
      let value = trimmed.slice(colonIndex + 1).trim().replace(/^["']|["']$/g, "");
      if (!value) {
        // Empty value = start of nested sub-array
        subArrayKey = key;
        currentObj[key] = [];
      } else {
        subArrayKey = null;
        if (value === "true") value = true;
        else if (value === "false") value = false;
        currentObj[key] = value;
      }
    }
  }

  return result;
}

// ===== Upload image to Sanity =====
async function uploadImage(filePath) {
  if (!existsSync(filePath)) {
    console.warn(`  Image not found: ${filePath}`);
    return null;
  }
  try {
    const imageBuffer = readFileSync(filePath);
    const ext = extname(filePath).slice(1);
    const contentType = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : `image/${ext}`;
    const asset = await sanityClient.assets.upload("image", imageBuffer, {
      filename: basename(filePath),
      contentType,
    });
    console.log(`  Uploaded: ${basename(filePath)} → ${asset._id}`);
    return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
  } catch (err) {
    console.error(`  Failed to upload ${filePath}:`, err.message);
    return null;
  }
}

// ===== Migrate site settings =====
async function migrateSiteSettings() {
  console.log("\n=== Migrating Site Settings ===");
  const yamlPath = join(JEKYLL_ROOT, "_data", "clinic.yml");
  const data = parseSimpleYaml(readFileSync(yamlPath, "utf-8"));

  const doc = {
    _id: "siteSettings",
    _type: "siteSettings",
    phone1: data.phone1,
    phone2: data.phone2,
    email: data.email,
    address: data.address,
  };

  await sanityClient.createOrReplace(doc);
  console.log("  Site settings created.");
}

// ===== Migrate doctors =====
async function migrateDoctors() {
  console.log("\n=== Migrating Doctors ===");
  const yamlPath = join(JEKYLL_ROOT, "_data", "doctors.yml");
  const data = parseSimpleYaml(readFileSync(yamlPath, "utf-8"));

  const doctors = data.doctors || [];
  for (let i = 0; i < doctors.length; i++) {
    const doc = doctors[i];
    const specialties = Array.isArray(doc.specialties) ? doc.specialties : [];

    const sanityDoc = {
      _id: `doctor-${i}`,
      _type: "doctor",
      name: doc.name,
      title: doc.title,
      tag: doc.tag,
      initial: doc.initial,
      specialties,
      order: i + 1,
    };

    await sanityClient.createOrReplace(sanityDoc);
    console.log(`  Doctor created: ${doc.name}`);
  }
}

// ===== Migrate hours =====
async function migrateHours() {
  console.log("\n=== Migrating Hours ===");
  const yamlPath = join(JEKYLL_ROOT, "_data", "hours.yml");
  const data = parseSimpleYaml(readFileSync(yamlPath, "utf-8"));

  const schedule = (data.schedule || []).map((item, i) => ({
    _key: `schedule-${i}`,
    day: item.day,
    time: item.time,
    highlight: item.highlight === true || item.highlight === "true",
    closed: item.closed === true || item.closed === "true",
  }));

  const doc = {
    _id: "hours",
    _type: "hours",
    schedule,
  };

  await sanityClient.createOrReplace(doc);
  console.log("  Hours created.");
}

// ===== Migrate hero slides =====
async function migrateHeroSlides() {
  console.log("\n=== Migrating Hero Slides ===");
  const yamlPath = join(JEKYLL_ROOT, "_data", "hero.yml");
  const data = parseSimpleYaml(readFileSync(yamlPath, "utf-8"));

  const slides = data.slides || [];
  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    const imagePath = join(JEKYLL_ROOT, slide.image);
    const imageRef = await uploadImage(imagePath);

    const doc = {
      _id: `heroSlide-${i}`,
      _type: "heroSlide",
      alt: slide.alt,
      order: i + 1,
      ...(imageRef && { image: imageRef }),
    };

    await sanityClient.createOrReplace(doc);
    console.log(`  Hero slide created: ${slide.alt}`);
  }
}

// ===== Parse markdown front matter =====
function parseFrontMatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };

  const metaStr = match[1];
  const body = match[2];
  const meta = {};

  for (const line of metaStr.split("\n")) {
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;
    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();
    value = value.replace(/^["']|["']$/g, "");
    meta[key] = value;
  }

  return { meta, body };
}

// ===== Convert markdown to Portable Text =====
function markdownToPortableText(markdown, postImageMap) {
  const blocks = [];
  const lines = markdown.split("\n");
  let currentParagraph = [];
  let blockKey = 0;

  function flushParagraph() {
    if (currentParagraph.length === 0) return;
    const text = currentParagraph.join("\n").trim();
    if (!text) {
      currentParagraph = [];
      return;
    }

    // Check for image
    const imgMatch = text.match(/!\[([^\]]*)\]\(([^)]+)\)/);
    if (imgMatch) {
      const altText = imgMatch[1];
      const imgSrc = imgMatch[2];
      // Check if we have this image uploaded
      if (postImageMap && postImageMap[imgSrc]) {
        blocks.push({
          _type: "image",
          _key: `block-${blockKey++}`,
          asset: { _type: "reference", _ref: postImageMap[imgSrc] },
          alt: altText || undefined,
        });
      }
      // Also add any remaining text
      const remainingText = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/, "").trim();
      if (remainingText) {
        blocks.push({
          _type: "block",
          _key: `block-${blockKey++}`,
          style: "normal",
          markDefs: [],
          children: [{ _type: "span", _key: `span-${blockKey}`, text: remainingText, marks: [] }],
        });
      }
    } else {
      // Check for HTML img tags
      const htmlImgRegex = /<img\s+src="([^"]+)"[^>]*>/g;
      let match;
      let lastIndex = 0;
      let hasImages = false;

      const tempText = text.replace(/<img\s+src="([^"]+)"[^>]*>/g, (fullMatch, src) => {
        hasImages = true;
        if (postImageMap && postImageMap[src]) {
          blocks.push({
            _type: "image",
            _key: `block-${blockKey++}`,
            asset: { _type: "reference", _ref: postImageMap[src] },
          });
        }
        return "";
      });

      const cleanText = tempText.replace(/<[^>]+>/g, "").trim();
      if (cleanText) {
        blocks.push({
          _type: "block",
          _key: `block-${blockKey++}`,
          style: "normal",
          markDefs: [],
          children: [{ _type: "span", _key: `span-${blockKey}`, text: cleanText, marks: [] }],
        });
      }

      if (!hasImages) {
        const plainText = text.replace(/<[^>]+>/g, "").trim();
        if (plainText && !cleanText) {
          blocks.push({
            _type: "block",
            _key: `block-${blockKey++}`,
            style: "normal",
            markDefs: [],
            children: [{ _type: "span", _key: `span-${blockKey}`, text: plainText, marks: [] }],
          });
        }
      }
    }

    currentParagraph = [];
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === "") {
      flushParagraph();
      continue;
    }

    // Headings
    if (trimmed.startsWith("## ")) {
      flushParagraph();
      blocks.push({
        _type: "block",
        _key: `block-${blockKey++}`,
        style: "h2",
        markDefs: [],
        children: [{ _type: "span", _key: `span-${blockKey}`, text: trimmed.slice(3), marks: [] }],
      });
      continue;
    }

    if (trimmed.startsWith("### ")) {
      flushParagraph();
      blocks.push({
        _type: "block",
        _key: `block-${blockKey++}`,
        style: "h3",
        markDefs: [],
        children: [{ _type: "span", _key: `span-${blockKey}`, text: trimmed.slice(4), marks: [] }],
      });
      continue;
    }

    currentParagraph.push(line);
  }

  flushParagraph();

  // Ensure at least one block
  if (blocks.length === 0) {
    blocks.push({
      _type: "block",
      _key: "block-empty",
      style: "normal",
      markDefs: [],
      children: [{ _type: "span", _key: "span-empty", text: "", marks: [] }],
    });
  }

  return blocks;
}

// ===== Migrate posts =====
async function migratePosts() {
  console.log("\n=== Migrating Posts ===");
  const postsDir = join(JEKYLL_ROOT, "_posts");
  const files = readdirSync(postsDir).filter((f) => f.endsWith(".md")).sort();

  console.log(`  Found ${files.length} posts`);

  for (const file of files) {
    const content = readFileSync(join(postsDir, file), "utf-8");
    const { meta, body } = parseFrontMatter(content);

    // Extract slug from filename: YYYY-MM-DD-title-slug.md
    const fileBasename = file.replace(/\.md$/, "");
    const dateMatch = fileBasename.match(/^(\d{4}-\d{2}-\d{2})-(.+)$/);
    const slug = dateMatch ? dateMatch[2] : fileBasename;
    const dateStr = meta.date || (dateMatch ? dateMatch[1] : "2022-01-01");

    // Sanity doc IDs: only a-z, 0-9, -, _, .
    const safeId = slug.replace(/[^a-zA-Z0-9_.-]/g, "-").replace(/-+/g, "-").slice(0, 128);

    console.log(`  Processing: ${meta.title || file}`);

    // Find and upload images from post body
    const postImageMap = {};
    const imgRegex = /(?:<img\s+src="|!\[[^\]]*\]\()([^")\s]+)/g;
    let imgMatch;
    const imagePaths = new Set();

    while ((imgMatch = imgRegex.exec(body)) !== null) {
      imagePaths.add(imgMatch[1]);
    }

    for (const imgSrc of imagePaths) {
      const imgPath = join(JEKYLL_ROOT, imgSrc);
      if (existsSync(imgPath)) {
        try {
          const imageBuffer = readFileSync(imgPath);
          const ext = extname(imgPath).slice(1);
          const contentType = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : `image/${ext}`;
          const asset = await sanityClient.assets.upload("image", imageBuffer, {
            filename: basename(imgPath),
            contentType,
          });
          postImageMap[imgSrc] = asset._id;
          console.log(`    Image uploaded: ${basename(imgPath)}`);
        } catch (err) {
          console.error(`    Failed to upload image ${imgSrc}:`, err.message);
        }
      }
    }

    // Convert markdown body to Portable Text
    const portableTextBody = markdownToPortableText(body, postImageMap);

    // Get thumbnail from first image
    const firstImageRef = Object.values(postImageMap)[0];

    const doc = {
      _id: `post-${safeId}`,
      _type: "post",
      title: meta.title || fileBasename,
      slug: { _type: "slug", current: slug },
      date: new Date(dateStr).toISOString(),
      category: meta.category || "general",
      author: meta.author || "",
      body: portableTextBody,
      ...(firstImageRef && {
        thumbnail: { _type: "image", asset: { _type: "reference", _ref: firstImageRef } },
      }),
    };

    await sanityClient.createOrReplace(doc);
    console.log(`    Post created: ${meta.title || slug}`);
  }
}

// ===== Main =====
async function main() {
  console.log("Starting migration from Jekyll to Sanity...");
  console.log(`Project: ${projectId}, Dataset: ${dataset}`);
  console.log(`Jekyll root: ${JEKYLL_ROOT}`);

  if (!existsSync(JEKYLL_ROOT)) {
    console.error(`Jekyll site not found at ${JEKYLL_ROOT}`);
    process.exit(1);
  }

  try {
    await migrateSiteSettings();
    await migrateDoctors();
    await migrateHours();
    await migrateHeroSlides();
    await migratePosts();
    console.log("\n=== Migration Complete! ===");
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

main();
