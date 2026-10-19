import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../../../components/Layout";
import { btn, money, catName } from "../../../components/training/ui";
import { api, hasToken } from "../../../lib/trainingApi";

export default function CourseDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [c, setC] = useState(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (id) api(`/courses/${id}`).then(setC).catch((e) => setErr(e.message)); }, [id]);

  async function buy() {
    if (!hasToken()) return router.push(`/training/login?next=${encodeURIComponent(`/training/courses/${id}`)}`);
    setBusy(true); setErr("");
    try { window.location.href = (await api(`/courses/${id}/checkout`, "POST")).url; } // off to Paystack
    catch (e) { setErr(e.message); setBusy(false); }
  }

  if (!c) return <Layout title="Course"><p className="mx-auto max-w-4xl px-5 py-24 text-sm text-ink/60 sm:px-8">{err || "Loading…"}</p></Layout>;
  const i = c.instructorInfo;
  return (
    <Layout title={`${c.title} — NexaDataEase Training`}>
      <section className="mx-auto grid max-w-5xl gap-10 px-5 pb-20 pt-14 sm:px-8 sm:pt-20 md:grid-cols-[1fr_300px]">
        <div>
          <p className="text-xs uppercase tracking-wide text-bronze">{catName(c.category)} · {c.level}</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight">{c.title}</h1>
          <p className="mt-5 whitespace-pre-wrap text-[15px] leading-relaxed text-ink/75">{c.description}</p>

          <h2 className="mt-10 text-2xl font-semibold">What is inside</h2>
          <ol className="mt-3 divide-y divide-line bg-white text-sm">
            {c.lessons.map((l, n) => <li key={n} className="px-4 py-3">{n + 1}. {l.title}</li>)}
          </ol>

          <h2 className="mt-10 text-2xl font-semibold">Your instructor</h2>
          <div className="mt-3 border-l-4 border-green bg-white p-5 text-sm">
            <p className="font-semibold">{i.name}</p>
            <p className="text-ink/60">{i.qualification} · {i.yearsExperience} years of experience</p>
            <p className="mt-3 whitespace-pre-wrap text-ink/75">{i.bio}</p>
          </div>
        </div>

        <aside className="h-fit border-l-4 border-green bg-white p-6 md:sticky md:top-24">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {c.thumbnail && <img src={c.thumbnail} alt="" className="mb-4 aspect-video w-full object-cover" />}
          <p className="text-3xl font-semibold text-navy">{money(c.price)}</p>
          <p className="mt-1 text-sm text-ink/60">{c.lessonCount} lessons · lifetime access</p>
          {c.owned
            ? <Link href={`/training/learn/${c.id}`} className={`${btn} mt-5 block text-center`}>Go to course</Link>
            : <button onClick={buy} disabled={busy} className={`${btn} mt-5 w-full`}>{busy ? "Redirecting to Paystack…" : "Buy with Paystack"}</button>}
          {err && <p className="mt-3 text-sm text-red-700" role="alert">{err}</p>}
          <p className="mt-3 text-xs text-ink/50">Secure payment by Paystack. You need a student account to buy.</p>
        </aside>
      </section>
    </Layout>
  );
}