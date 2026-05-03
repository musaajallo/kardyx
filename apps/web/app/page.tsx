export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-8 py-24">
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-clay-deep">Phase 1 · Foundation</p>
      <h1 className="mt-6 font-display text-6xl font-semibold leading-none tracking-tight">
        Kardyx<span className="text-clay">.</span>
      </h1>
      <p className="mt-8 max-w-xl font-body text-lg italic leading-relaxed text-ink-soft">
        The cards in your hand are the interface.{' '}
        <em className="not-italic font-medium text-clay-deep">The game lives in the engine.</em>
      </p>
      <div className="mt-12 grid grid-cols-2 gap-6 font-mono text-xs uppercase tracking-[0.18em] text-slate">
        <div>
          <div className="text-ink font-medium">Stack</div>
          Next.js · Fastify · Expo · Drizzle · Lucia
        </div>
        <div>
          <div className="text-ink font-medium">Status</div>
          Scaffold complete · pnpm install pending
        </div>
      </div>
    </main>
  );
}
