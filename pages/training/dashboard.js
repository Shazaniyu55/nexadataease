import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { COURSES } from "../../lib/courses";
import { api, clearToken } from "../../lib/trainingApi";
import CbtPanel from "../../components/training/CbtPanel";
import MyCourses from "../../components/training/MyCourses";

// const TABS = [["overview", "Overview"], ["learning", "My learning"], ["cbt", "CBT"]];
const TABS = [["overview", "Overview"], ["learning", "My learning"], ["courses", "My courses"], ["cbt", "CBT"]];
function Bar({ pct }) {
  return (
    <div className="h-2 w-full bg-line" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-2 bg-green transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [me, setMe] = useState(null);
  const [tab, setTab] = useState("overview");
  const [err, setErr] = useState("");

  useEffect(() => {
    api("/me").then(setMe).catch(() => { clearToken(); router.replace("/training/login"); });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!me) {
    return (
      <Layout title="Student dashboard — NexaDataEase">
        <p className="mx-auto max-w-6xl px-5 py-24 text-sm text-ink/60 sm:px-8">Loading your dashboard…</p>
      </Layout>
    );
  }

  const course = COURSES.find((c) => c.id === me.course);
  const pct = Math.round((me.progress.length / course.lessons.length) * 100);

  async function toggle(i) {
    setErr("");
    try { setMe(await api("/progress", "POST", { lesson: i })); } catch (e) { setErr(e.message); }
  }
  function logout() { clearToken(); router.push("/training"); }

  return (
    <Layout title="Student dashboard — NexaDataEase Training">
      <section className="mx-auto max-w-6xl px-5 pb-20 pt-10 sm:px-8 sm:pt-14">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-ink/45">Student dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold">Hello, {me.name.split(" ")[0]}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="border border-line bg-white px-3 py-2 font-mono text-sm text-navy">{me.studentId}</span>
            <button onClick={logout} className="rounded-sm border border-line px-4 py-2 text-sm hover:bg-white">Log out</button>
          </div>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-[190px_1fr]">
          <nav className="flex gap-2 overflow-x-auto md:flex-col">
            {TABS.map(([k, t]) => (
              <button key={k} onClick={() => setTab(k)}
                className={`whitespace-nowrap rounded-sm px-4 py-2.5 text-left text-sm transition-colors ${tab === k ? "bg-navy text-white" : "text-ink/75 hover:bg-white"}`}>
                {t}
              </button>
            ))}
          </nav>

          <div>
            {tab === "overview" && (
              <div className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-3">
                  {[["Student ID", me.studentId], ["Program", course.title], ["Progress", `${pct}%`]].map(([k, v]) => (
                    <div key={k} className="border-l-4 border-green bg-white p-5">
                      <p className="text-xs uppercase tracking-wide text-ink/45">{k}</p>
                      <p className="mt-2 text-lg font-semibold">{v}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-white p-6">
                  <p className="text-xs uppercase tracking-wide text-ink/45">Your progress</p>
                  <div className="mt-3"><Bar pct={pct} /></div>
                  <p className="mt-2 text-sm text-ink/65">{me.progress.length} of {course.lessons.length} lessons completed</p>
                  <p className="mt-5 text-sm text-ink/65">{me.email}{me.phone ? ` · ${me.phone}` : ""}</p>
                </div>
              </div>
            )}

            {tab === "learning" && (
              <div className="bg-white p-6">
                <h2 className="text-2xl font-semibold">{course.title}</h2>
                <p className="mt-1 text-sm text-ink/60">{course.duration} · tick each lesson when you finish it.</p>
                <div className="mt-5"><Bar pct={pct} /></div>
                <p className="mt-2 text-sm text-ink/65">{pct}% complete</p>
                {err && <p className="mt-3 text-sm text-red-700" role="alert">{err}</p>}
                <ul className="mt-4 divide-y divide-line">
                  {course.lessons.map((l, i) => {
                    const done = me.progress.includes(i);
                    return (
                      <li key={l}>
                        <label className="flex cursor-pointer items-center gap-3 py-3.5">
                          <input type="checkbox" checked={done} onChange={() => toggle(i)} className="h-5 w-5 accent-green" />
                          <span className={done ? "text-ink/45 line-through" : ""}>{i + 1}. {l}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            {tab === "courses" && <MyCourses />}
            {tab === "cbt" && <CbtPanel />}
          </div>
        </div>
      </section>
    </Layout>
  );
}
