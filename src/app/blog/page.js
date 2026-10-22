import Link from "next/link";
import { articles } from "@/lib/articles";

export const metadata = { title: "Blog", description: "Ideas for social content and distribution from Hokvibe.", alternates: { canonical: "/blog" } };

export default function Blog() {
  return <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16"><h1 className="text-3xl font-bold">Hokvibe Blog</h1><p className="mt-3 text-zinc-400">Practical ideas for creating and sharing content.</p>{articles.length ? <ul className="mt-8 divide-y divide-zinc-800">{articles.map(article => <li key={article.slug} className="py-5"><Link className="text-lg font-semibold" href={`/blog/${article.slug}`}>{article.title}</Link><p className="mt-2 text-sm text-zinc-400">{article.description}</p></li>)}</ul> : <p className="mt-8 text-sm text-zinc-400">Articles are coming soon.</p>}<Link href="/studio" className="mt-8 inline-block text-sm text-emerald-400">Go to Studio</Link></main>;
}
