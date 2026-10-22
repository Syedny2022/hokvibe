import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { articles } from "@/lib/articles";

export async function generateStaticParams() { return articles.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = articles.find(item => item.slug === slug);
  return article ? { title: article.title, description: article.description, alternates: { canonical: `/blog/${slug}` }, openGraph: { type: "article", title: article.title, description: article.description, url: `/blog/${slug}` }, twitter: { card: "summary", title: article.title, description: article.description } } : {};
}
export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = articles.find(item => item.slug === slug);
  if (!article) notFound();
  const schema = { "@context": "https://schema.org", "@type": "BlogPosting", headline: article.title, description: article.description, mainEntityOfPage: `https://hokvibe.com/blog/${slug}`, publisher: { "@type": "Organization", name: "Hokvibe", url: "https://hokvibe.com" } };
  return <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} /><Link href="/blog" className="text-sm text-emerald-400">Back to blog</Link><article className="[&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_p]:mt-4 [&_p]:leading-7 [&_p]:text-zinc-300 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mt-2"><h1 className="mt-6 text-3xl font-bold">{article.title}</h1><ReactMarkdown>{article.markdown}</ReactMarkdown></article><Link className="mt-10 inline-block text-emerald-400" href="/studio">Try the Studio</Link></main>;
}
