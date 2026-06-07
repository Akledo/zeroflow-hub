module.exports = function(eleventyConfig) {
  // --- Passthrough ---
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/_data/site.json");

  // --- Shortcodes ---
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
  eleventyConfig.addShortcode("lastUpdated", (date) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return String(date);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  });

  // --- Filters ---
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    if (!dateObj) return "";
    const d = typeof dateObj === "string" ? new Date(dateObj) : dateObj;
    if (isNaN(d.getTime())) return String(dateObj);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  });

  eleventyConfig.addFilter("slugify", (str) => {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  });

  eleventyConfig.addFilter("limit", (arr, count) => {
    return arr ? arr.slice(0, count) : [];
  });

  eleventyConfig.addFilter("where", (arr, key, value) => {
    if (!arr) return [];
    return arr.filter(item => item.data && item.data[key] === value);
  });

  eleventyConfig.addFilter("dateToRfc822", (dateStr) => {
    const d = new Date(dateStr);
    return d.toUTCString();
  });

  eleventyConfig.addFilter("json", (value) => {
    return JSON.stringify(value);
  });

  // --- Collections ---
  eleventyConfig.addCollection("allArticles", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/content/*.md").reverse();
  });

  eleventyConfig.addCollection("categories", function(collectionApi) {
    const articles = collectionApi.getFilteredByGlob("src/content/*.md");
    const cats = new Set();
    articles.forEach(a => {
      if (a.data.category) cats.add(a.data.category);
    });
    return [...cats].sort();
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};