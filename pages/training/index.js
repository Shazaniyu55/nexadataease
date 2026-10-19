import Link from "next/link";
import Layout from "../../components/Layout";
import { COURSES } from "../../lib/courses";

const STEPS = [
  ["01", "Register", "Create your student account and pick a program."],
  ["02", "Get your student ID", "Every student receives a unique ID the moment they sign up."],
  ["03", "Learn and track", "Tick off lessons in your dashboard and watch your progress."],
  ["04", "Get tested", "Computer-based tests (CBT)."],
];

export default function Training() {
  return (
    <Layout
      title="Tech Training — NexaDataEase"
      description="Practical, project-based tech training from NexaDataEase. Register, get your student ID and track your learning."
    >
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <p className="text-xs uppercase tracking-wide text-bronze-light">NexaDataEase Training</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight sm:text-6xl">
            Learn tech skills by building real products.
          </h1>
          <p className="mt-6 max-w-prose text-[15px] leading-relaxed text-white/70">
            Hands-on training from the team that ships DataEase and TruBook.
            Register, get your student ID, and follow your progress from your own dashboard.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/training/register" className="rounded-sm bg-green px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-green-dark">
              Register now
            </Link>
            <Link href="/training/login" className="rounded-sm border border-white/30 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10">
              Student login
            </Link>

          <Link href="/training/courses" className="rounded-sm border border-white/30 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10">
              Browse courses
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <p className="text-xs uppercase tracking-wide text-ink/45">Programs</p>
        <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Pick your track</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {COURSES.map((c) => (
            <div key={c.id} className="flex flex-col border-l-4 border-green bg-white p-6">
              <p className="text-xs uppercase tracking-wide text-bronze">{c.duration}</p>
              <h3 className="mt-2 text-xl font-semibold">{c.title}</h3>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink/70">{c.blurb}</p>
              <Link href={`/training/register?course=${c.id}`} className="mt-5 text-sm font-medium text-navy hover:text-green-dark">
                Enroll in this program →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <p className="text-xs uppercase tracking-wide text-ink/45">How it works</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">From sign-up to certified</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(([n, t, d]) => (
              <div key={n}>
                <p className="font-display text-3xl font-semibold text-green">{n}</p>
                <h3 className="mt-2 text-lg font-semibold">{t}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink/70">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 text-center sm:px-8">
        <h2 className="text-3xl font-semibold">Ready to start?</h2>
        <Link href="/training/register" className="mt-6 inline-block rounded-sm bg-navy px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-navy-dark">
          Create your student account
        </Link>
                <p className="mt-8 text-sm text-ink/60">
          Experienced in tech? <Link href="/training/instructor/register" className="text-navy underline">Apply to teach and sell your courses</Link>
        </p>
      </section>
    </Layout>
  );
}