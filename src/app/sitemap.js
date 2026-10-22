import { articles } from "@/lib/articles";

export default function sitemap() {
  const paths = ["", "/about", "/contact", "/faq", "/privacy", "/terms", "/blog"];
  return [...paths.map(path => ({ url: `https://hokvibe.com${path}` })), ...articles.map(article => ({ url: `https://hokvibe.com/blog/${article.slug}`, ...(article.updatedAt ? { lastModified: article.updatedAt } : {}) }))];
}
