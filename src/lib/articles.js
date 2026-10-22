import { readFileSync } from "node:fs";
import { join } from "node:path";

const source = readFileSync(join(process.cwd(), "content", "articles.md"), "utf8");

export const articles = source.split(/^# /m).filter(Boolean).map((entry) => {
  const [title, ...lines] = entry.trim().split(/\r?\n/);
  const markdown = lines.join("\n").trim();
  const description = lines.find((line) => line.trim())?.trim() || "";
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return { title, slug, description, markdown };
});
