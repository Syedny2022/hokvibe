export default function ContactPage() {
  return (
    <main className="min-h-dvh bg-bg-page text-primary-text">
      <section className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-[10px] font-black uppercase tracking-widest text-primary">
          Contact Hokvibe
        </p>
        <h1 className="text-3xl font-black uppercase tracking-tight sm:text-4xl">
          Contact Us
        </h1>
        <h2 className="max-w-2xl text-base font-medium leading-relaxed text-secondary-text">
          Questions, billing notes, or product feedback can be sent to contact@hokvibe.com.
        </h2>
        <a
          href="mailto:contact@hokvibe.com"
          className="mt-2 inline-flex w-fit rounded-full bg-primary px-5 py-2 text-sm font-bold text-white transition-all hover:bg-primary-hover"
        >
          Email Hokvibe
        </a>
      </section>
    </main>
  );
}
