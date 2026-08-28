import Link from "next/link";

const EVENT_DATE = "November 7, 2026";
const REGISTRATION_DEADLINE = "October 26, 2026";
const LOCATION = "Google Meet";

const TRACKS = [
  { label: "Startups", detail: "What starting your career in tech looks like" },
  { label: "From Learning to Earning", detail: "Turning Skills into Opportunities" },
  { label: "Tech in the Age of AI", detail: "How AI is shaping the future of work" },
  { label: "Moderator", detail: "Technical discussion facilitator" },
];

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="grid-texture absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="relative mx-auto max-w-5xl px-6 py-20 sm:px-8 sm:py-28">
          <div className="waveform mb-8" aria-hidden="true">
            {Array.from({ length: 7 }).map((_, i) => (
              <span key={i} className="animate-pulse-bar" />
            ))}
          </div>

          <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-signal">
            Learn. Build. Connect. Grow.
          </p>

          <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-paper sm:text-6xl">
            Tech & Career Talk
            <span className="block text-slate-light">0.1</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-light sm:text-lg">
            A practical conversation for students, beginners,
            and young professionals who wants to start,
            grow and succeed in technology.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-lg bg-[#16a34a] px-7 py-3.5 font-display text-sm font-semibold text-white transition hover:bg-[#15803d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16a34a]"
            >
              Register for the event
            </Link>
            <p className="font-mono text-xs text-slate">
              FREE REGISTRATION · LIMITED TO 100 SEATS PARTICIPANTS 
            </p>
          </div>

          {/* Event facts strip */}
          <dl className="mt-16 grid grid-cols-1 gap-6 border-t border-line pt-8 sm:grid-cols-3">
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate">
                Event date
              </dt>
              <dd className="mt-1 font-display text-lg text-paper">{EVENT_DATE}</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate">
                Registration deadline
              </dt>
              <dd className="mt-1 font-display text-lg text-coral">
                {REGISTRATION_DEADLINE}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate">
                Location
              </dt>
              <dd className="mt-1 font-display text-lg text-paper">{LOCATION}</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Tracks */}
      <section className="mx-auto max-w-5xl px-6 py-16 sm:px-8 sm:py-20">
        <h2 className="font-display text-2xl font-semibold text-paper">
          What to Expect
        </h2>
        <p className="mt-2 max-w-xl text-sm text-slate-light">
          3 Speakers, 3 Topics, 3 Hours. Each speaker will share their experience and insights on the topic they 
          are most passionate about. You&apos;ll have the opportunity to ask questions and network with other attendees.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
          {TRACKS.map((track) => (
            <div key={track.label} className="bg-ink-raised p-6">
              <p className="font-display text-lg text-paper">{track.label}</p>
              <p className="mt-1.5 text-sm text-slate-light">{track.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center sm:px-8 sm:py-20">
          <h2 className="font-display text-2xl font-semibold text-paper sm:text-3xl">
            Save your seat before <span className="text-coral">{REGISTRATION_DEADLINE}</span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-slate-light">
            Registration takes about two minutes. You&apos;ll get a confirmation
            once it&apos;s in.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-[#16a34a] px-7 py-3.5 font-display text-sm font-semibold text-white transition hover:bg-[#15803d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16a34a]"
          >
            Start registration
          </Link>
        </div>
      </section>
    </main>
  );
}
