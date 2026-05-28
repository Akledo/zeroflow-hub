#!/usr/bin/env node

/**
 * ZeroFlow Content Injection Script
 * 
 * Reads a JSON file containing article data and generates
 * Eleventy-compatible Markdown files in src/content/.
 * 
 * Usage:
 *   node scripts/inject-content.js < path/to/articles.json
 *   node scripts/inject-content.js ./articles.json
 * 
 * JSON format:
 * {
 *   "articles": [
 *     {
 *       "title": "Article Title",
 *       "description": "SEO meta description...",
 *       "date": "2026-05-28",
 *       "category": "Category Name",
 *       "author": "Author Name",
 *       "body": "Full markdown content...",
 *       "relatedProducts": [...],
 *       "prosCons": { "pros": [...], "cons": [...] },
 *       "faq": [...]
 *     }
 *   ]
 * }
 */

const fs = require("fs");
const path = require("path");

const CONTENT_DIR = path.join(__dirname, "..", "src", "content");

// Ensure content directory exists
if (!fs.existsSync(CONTENT_DIR)) {
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
}

// Read input
let articles;
const inputFile = process.argv[2];

if (inputFile) {
  try {
    const raw = fs.readFileSync(inputFile, "utf-8");
    articles = JSON.parse(raw).articles || JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading input file: ${err.message}`);
    process.exit(1);
  }
} else {
  // Read from stdin
  let inputData = "";
  process.stdin.on("data", chunk => (inputData += chunk));
  process.stdin.on("end", () => {
    try {
      articles = JSON.parse(inputData).articles || JSON.parse(inputData);
      processArticles(articles);
    } catch (err) {
      console.error(`Error parsing JSON: ${err.message}`);
      process.exit(1);
    }
  });
  return; // exit handled in on("end")
}

if (articles) {
  processArticles(articles);
}

/**
 * Generate a URL-safe slug from a title string
 */
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Convert article data to a Markdown file with YAML front matter
 */
function articleToFrontMatter(article) {
  const date = article.date || new Date().toISOString().split("T")[0];
  const slug = slugify(article.title);

  // Build YAML front matter
  let yaml = "---\n";
  yaml += `title: "${(article.title || "").replace(/"/g, '\\"')}"\n`;
  yaml += `description: "${(article.description || "").replace(/"/g, '\\"')}"\n`;
  yaml += `date: ${date}\n`;
  if (article.category) yaml += `category: "${article.category.replace(/"/g, '\\"')}"\n`;
  if (article.author) yaml += `author: "${article.author.replace(/"/g, '\\"')}"\n`;

  // Related products
  if (article.relatedProducts && article.relatedProducts.length > 0) {
    yaml += "relatedProducts:\n";
    article.relatedProducts.forEach(p => {
      yaml += `  - name: "${(p.name || "").replace(/"/g, '\\"')}"\n`;
      if (p.description) yaml += `    description: "${p.description.replace(/"/g, '\\"')}"\n`;
      if (p.rating) yaml += `    rating: ${p.rating}\n`;
      if (p.price) yaml += `    price: "${p.price.replace(/"/g, '\\"')}"\n`;
      if (p.affiliateUrl) yaml += `    affiliateUrl: "${p.affiliateUrl.replace(/"/g, '\\"')}"\n`;
    });
  }

  // Pros/cons
  if (article.prosCons) {
    yaml += "prosCons:\n";
    if (article.prosCons.pros && article.prosCons.pros.length > 0) {
      yaml += "  pros:\n";
      article.prosCons.pros.forEach(p => yaml += `    - "${p.replace(/"/g, '\\"')}"\n`);
    }
    if (article.prosCons.cons && article.prosCons.cons.length > 0) {
      yaml += "  cons:\n";
      article.prosCons.cons.forEach(c => yaml += `    - "${c.replace(/"/g, '\\"')}"\n`);
    }
  }

  // FAQ
  if (article.faq && article.faq.length > 0) {
    yaml += "faq:\n";
    article.faq.forEach(q => {
      yaml += `  - question: "${(q.question || "").replace(/"/g, '\\"')}"\n`;
      yaml += `    answer: "${(q.answer || "").replace(/"/g, '\\"')}"\n`;
    });
  }

  yaml += "layout: layouts/article.njk\n";
  yaml += "schemaType: Article\n";
  yaml += "---\n\n";

  // Body content
  yaml += article.body || "";

  return { slug, content: yaml };
}

/**
 * Process all articles and write files
 */
function processArticles(articles) {
  if (!Array.isArray(articles)) {
    // Single article
    articles = [articles];
  }

  let count = 0;
  articles.forEach(article => {
    const { slug, content } = articleToFrontMatter(article);
    const filePath = path.join(CONTENT_DIR, `${slug}.md`);
    fs.writeFileSync(filePath, content, "utf-8");
    console.log(`✓ Created: ${filePath}`);
    count++;
  });

  console.log(`\nDone! ${count} article(s) written to ${CONTENT_DIR}`);
}