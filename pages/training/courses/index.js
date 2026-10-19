import { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { CourseCard, CATS } from "../../../components/training/ui";
import { api } from "../../../lib/trainingApi";

export default function Courses() {
  const [cat, setCat] = useState("");
  const [list, setList] = useState(null);
  const [err, setErr] = useState("");
  useEffect(() => {
    setList(null);
    api(`/courses${cat ? `?category=${cat}` : ""}`).then(setList).catch((e) => setErr(e.message));
  }, [cat]);

  return (
    <Layout title="Courses — NexaDataEase Training" description="Buy and learn from tech courses taught by vetted instructors.">
      <section className="mx-auto max-w-6xl px-5 pb-20 pt-14 sm:px-8 sm:pt-20">
        <p className="text-xs uppercase tracking-wide text-ink/45">Courses</p>
        <h1 className="mt-3 text-4xl font-semibold">Learn from vetted instructors.</h1>
        <div className="mt-6 flex flex-wrap gap-2">
          {[["", "All"], ...CATS].map(([v, t]) => (
            <button key={v} onClick={() => setCat(v)} className={`rounded-sm px-4 py-2 text-sm ${cat === v ? "bg-navy text-white" : "bg-white text-ink/75"}`}>{t}</button>
          ))}
        </div>
        {err && <p className="mt-6 text-sm text-red-700">{err}</p>}
        {list && !list.length && <p className="mt-10 text-ink/60">No courses here yet. Check back soon.</p>}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(list || []).map((c) => <CourseCard key={c.id} c={c} href={`/training/courses/${c.id}`} />)}
        </div>
      </section>
    </Layout>
  );
}