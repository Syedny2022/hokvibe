export default function PrivacyPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-4 py-12 text-primary-text sm:px-6 lg:px-8">
      <p className="text-[10px] font-black uppercase tracking-widest text-purple-400">
        Hokvibe
      </p>
      <h1 className="text-3xl font-black tracking-tight text-white">Privacy</h1>
      <p className="text-sm leading-relaxed text-secondary-text">
        Hokvibe stores account, credit, and generation history data required to run the social content engine. User authentication, billing, database persistence, and MuAPI generation follow the existing application architecture configured by the site owner.
      </p>
      <p className="text-sm leading-relaxed text-secondary-text">
        Production privacy terms should be reviewed before paid public launch, especially after Stripe, Google OAuth, analytics, and distribution integrations are connected.
      </p>
    </main>
  );
}
