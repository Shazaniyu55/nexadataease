import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../../../components/Layout";
import { api, clearToken } from "../../../lib/trainingApi";

export default function Learn() {
  const router = useRouter();
  const { id } = router.query;
  const [c, setC] = useState(null);
  const [n, setN] = useState(0);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!id) return;
    api(`/courses/${id}/learn`).then(setC).catch((e) => {
      if (/log in/i.test(e.message)) { clearToken(); router.replace(`/training/login?next=${encodeURIComponent(`/training/learn/${id}`)}`); } else setErr(e.message);
    });
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!c) return (
    <Layout title="Course"><p className="mx-auto max-w-4xl px-5 py-24 text-sm text-ink/60 sm:px-8">
      {err || "Loading…"} {err && <Link href={`/training/courses/${id}`} className="underline">View course page</Link>}</p></Layout>
  );
  const l = c.lessons[n];
  return (
    <Layout title={`${c.title} — Learn`}>
      <section className="mx-auto max-w-6xl px-5 pb-20 pt-10 sm:px-8">
        <Link href="/training/dashboard" className="text-sm text-navy underline">← My courses</Link>
        <h1 className="mt-3 text-3xl font-semibold">{c.title}</h1>
        <div className="mt-6 grid gap-6 md:grid-cols-[1fr_280px]">
          <div className="bg-white p-4">
            {l && (l.kind === "video"
              ? <video key={l.id} controls controlsList="nodownload" className="aspect-video w-full bg-black" src={l.url} />
              : <div className="p-8 text-center"><p className="mb-4 text-ink/70">{l.name}</p><a href={l.url} target="_blank" rel="noopener noreferrer" className="rounded-sm bg-navy px-6 py-3 text-sm text-white">Open material</a></div>)}
            <h2 className="mt-4 text-xl font-semibold">{n + 1}. {l && l.title}</h2>
          </div>
          <ol className="h-fit divide-y divide-line bg-white text-sm">
            {c.lessons.map((x, i) => (
              <li key={x.id}><button onClick={() => setN(i)} className={`w-full px-4 py-3 text-left ${i === n ? "bg-navy text-white" : "hover:bg-paper"}`}>{i + 1}. {x.title}</button></li>
            ))}
          </ol>
        </div>
      </section>
    </Layout>
  );
}