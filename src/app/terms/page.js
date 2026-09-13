export default function TermsPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-4 py-12 text-primary-text sm:px-6 lg:px-8">
      <p className="text-[10px] font-black uppercase tracking-widest text-purple-400">
        Hokvibe
      </p>
      <h1 className="text-3xl font-black tracking-tight text-white">Terms</h1>
      <p className="text-sm leading-relaxed text-secondary-text">
        Hokvibe is a self-serve AI social content engine. Users are responsible for reviewing generated content before publishing it and for complying with platform rules, advertising standards, and applicable laws.
      </p>
      <p className="text-sm leading-relaxed text-secondary-text">
        Production terms should be finalized before paid public launch, especially after Stripe checkout, Google OAuth, MuAPI usage, and external publishing workflows are enabled.
      </p>
    </main>
  );
}
