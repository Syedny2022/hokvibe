import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const contentDirectory = join(process.cwd(), "content");
const blogDirectory = join(contentDirectory, "blog");

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function createArticle(entry) {
  const [heading, ...lines] = entry.trim().split(/\r?\n/);
  const title = heading.replace(/^#\s*/, "");
  const markdown = lines.join("\n").trim();
  const description = lines.find((line) => line.trim() && !line.trim().startsWith("<!--"))?.trim() || "";
  const slug = slugify(title);
  return { title, slug, description, markdown };
}

const bundledArticles = readFileSync(join(contentDirectory, "articles.md"), "utf8")
  .split(/^# /m)
  .filter(Boolean)
  .map((entry) => createArticle(`# ${entry}`));

const uploadedArticles = existsSync(blogDirectory)
  ? readdirSync(blogDirectory)
      .filter((file) => file.endsWith(".md"))
      .map((file) => createArticle(readFileSync(join(blogDirectory, file), "utf8")))
  : [];

// One source of truth for the blog index, page routes, and sitemap.
export const articles = [...bundledArticles, ...uploadedArticles];
