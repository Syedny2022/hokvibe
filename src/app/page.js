import Link from "next/link";

export const metadata = {
  title: "Stop Grinding Content. Vibe Is the Voice.",
  description: "Turn your ideas into editable social drafts with Hokvibe's AI content studio.",
  alternates: { canonical: "/" },
};

const questions = [
  ["What is Hokvibe?", "Hokvibe is a zero-bloat content engine built for solo founders. It takes the friction out of social media by transforming raw ideas into polished posts across multiple platforms instantly."],
  ["Why does Hokvibe exist?", "Because building a product is hard enough without spending three hours trying to write a catchy LinkedIn post or X thread. Hokvibe cuts your distribution time down to seconds."],
  ["How does cross-platform repurposing actually work?", "Instead of copy-pasting the same text everywhere (which algorithms hate), Hokvibe adapts your core idea into the native format, length, and tone required for each specific platform."],
  ["Do I need to give you my API keys or passwords?", "No. All social connections are handled securely through isolated OAuth handlers. We never store third-party credentials in our database."],
  ["What can I use as source material?", "Anything. A raw bullet-point list, a product release changelog, an article URL, or a quick voice-to-text note."],
];

export default function Home() {
  return <main>
    <section className="border-b border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <p className="text-sm font-semibold uppercase text-emerald-400">Vibe is the voice.</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-bold text-white sm:text-5xl">Stop Grinding Content. Vibe Is the Voice.</h1>
        <h2 className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-300">Turn raw notes, URLs, and rough thoughts into platform-native social posts in seconds. Built strictly for solo founders who&apos;d rather be building product.</h2>
        <Link href="/studio" className="mt-8 inline-block rounded bg-emerald-400 px-5 py-3 text-sm font-semibold text-zinc-950">Start free, no credit card required</Link>
      </div>
    </section>
    <section className="mx-auto max-w-6xl px-6 py-14" aria-labelledby="how-it-works">
      <h2 id="how-it-works" className="text-2xl font-semibold">How Hokvibe Actually Works Without the Marketing BS</h2>
      <div className="mt-8 grid gap-8 md:grid-cols-3">
        <div><p className="text-sm text-emerald-400">01 / INPUT</p><h3 className="mt-2 text-lg font-semibold">Dump Your Raw Thoughts</h3><p className="mt-2 text-sm leading-6 text-zinc-400">Drop in a product update, a GitHub commit note, a blog link, or a messy brain dump. Select your platform, tone, and length.</p></div>
        <div><p className="text-sm text-emerald-400">02 / CREATE</p><h3 className="mt-2 text-lg font-semibold">Generate &amp; Shape</h3><p className="mt-2 text-sm leading-6 text-zinc-400">Hit generate. Hokvibe structures your raw input into platform-native copy. Tweak the hook, fix the spacing, and lock it into your workspace.</p></div>
        <div><p className="text-sm text-emerald-400">03 / SHARE</p><h3 className="mt-2 text-lg font-semibold">Publish or Copy</h3><p className="mt-2 text-sm leading-6 text-zinc-400">One-click copy straight to your clipboard, or push directly through your connected social channels. You control every word before it goes live.</p></div>
      </div>
    </section>
    <section className="border-t border-zinc-800"><div className="mx-auto max-w-6xl px-6 py-14"><h2 className="text-2xl font-semibold">Real Answers, No Corporate Fluff</h2><dl className="mt-6 max-w-3xl divide-y divide-zinc-800">{questions.map(([q,a]) => <div key={q} className="py-5"><dt className="font-semibold">{q}</dt><dd className="mt-2 text-sm leading-6 text-zinc-400">{a}</dd></div>)}</dl><Link href="/faq" className="mt-4 inline-block text-sm text-emerald-400">More questions</Link></div></section>
  </main>;
}
