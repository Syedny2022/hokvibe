const faqs = [
  {
    question: "What is Hokvibe?",
    answer: "Hokvibe is an AI social content engine for turning rough ideas into platform-ready posts.",
  },
  {
    question: "Who is Hokvibe for?",
    answer: "It is built for solo founders, creators, and small brands that need consistent social content.",
  },
  {
    question: "Which platforms does Hokvibe support?",
    answer: "Hokvibe formats drafts for LinkedIn, Facebook Pages, Reddit, and X. X is preview-only.",
  },
  {
    question: "How do I sign in?",
    answer: "Use the Start Creating button and continue with Google on the login page.",
  },
];

export default function FaqPage() {
  return (
    <main className="min-h-dvh bg-bg-page text-primary-text">
      <section className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary">
            Hokvibe FAQ
          </p>
          <h1 className="text-3xl font-black uppercase tracking-tight sm:text-4xl">
            FAQ
          </h1>
          <h2 className="max-w-2xl text-base font-medium leading-relaxed text-secondary-text">
            Common questions about Hokvibe, supported platforms, and sign-in.
          </h2>
        </div>

        <div className="grid gap-4">
          {faqs.map((item) => (
            <article key={item.question} className="rounded-lg border border-divider bg-bg-card p-5">
              <h3 className="text-sm font-bold text-primary-text">{item.question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-secondary-text">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
