import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "../../lib/trainingApi";
import { CourseCard } from "./ui";

export default function MyCourses() {
  const [list, setList] = useState(null);
  const [err, setErr] = useState("");
  useEffect(() => { api("/my/courses").then(setList).catch((e) => setErr(e.message)); }, []);

  if (!list) return <p className="text-sm text-ink/60">{err || "Loading…"}</p>;
  if (!list.length) return (
    <div className="bg-white p-8 text-center">
      <p className="text-ink/70">You have not bought any courses yet.</p>
      <Link href="/training/courses" className="mt-4 inline-block rounded-sm bg-navy px-5 py-2.5 text-sm text-white">Browse courses</Link>
    </div>
  );
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {list.map((c) => <CourseCard key={c.id} c={c} href={`/training/learn/${c.id}`} action="Continue learning →" />)}
    </div>
  );
}