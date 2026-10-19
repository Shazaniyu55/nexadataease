import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { COURSES } from "../../lib/courses";
import { api, saveToken, clearToken, hasToken, ADMIN_KEY } from "../../lib/trainingApi";

const input = "mt-2 w-full border border-line bg-paper px-3 py-2.5 text-sm outline-none focus:border-navy";
const label = "text-xs uppercase tracking-wide text-ink/45";
const title = (id) => (COURSES.find((c) => c.id === id) || {}).title || id;

export default function Admin() {
  const [data, setData] = useState(null);
  const [q, setQ] = useState("");
  const [f, setF] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");

  async function loadData() {
    try { setData(await api("/admin/students", "GET", undefined, ADMIN_KEY)); setErr(""); }
    catch (e) { clearToken(ADMIN_KEY); setData(null); setErr(e.message); }
  }
  useEffect(() => { if (hasToken(ADMIN_KEY)) loadData(); }, []);

  async function login(e) {
    e.preventDefault(); setErr("");
    try {
      const d = await api("/admin/login", "POST", f, ADMIN_KEY);
      saveToken(d.token, ADMIN_KEY); await loadData();
    } catch (x) { setErr(x.message); }
  }
  async function toggleCbt() {
    try {
      const r = await api("/admin/cbt", "POST", { open: !data.cbtOpen }, ADMIN_KEY);
      setData({ ...data, cbtOpen: r.cbtOpen });
    } catch (e) { setErr(e.message); }
  }
  function exportCsv() {
    const rows = [["Student ID", "Name", "Email", "Phone", "Program", "Progress %", "CBT attempts", "Best CBT %", "Joined"],
      ...data.students.map((s) => [s.studentId, s.name, s.email, s.phone, title(s.course), s.progressPct, s.attempts, s.bestScore ?? "", s.createdAt.slice(0, 10)])];
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "students.csv"; a.click();
  }

  if (!data) {
    return (
      <Layout title="Admin — NexaDataEase Training">
        <section className="mx-auto max-w-xl px-5 pb-20 pt-16 sm:px-8 sm:pt-24">
          <p className={label}>Admin</p>
          <h1 className="mt-3 text-4xl font-semibold">Admin login</h1>
          <form onSubmit={login} className="mt-8 space-y-5 border-l-4 border-green bg-white p-6 sm:p-8">
            <div><label className={label} htmlFor="ae">Email</label>
              <input id="ae" type="email" required className={input} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
            <div><label className={label} htmlFor="ap">Password</label>
              <input id="ap" type="password" required className={input} value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></div>
            {err && <p className="text-sm text-red-700" role="alert">{err}</p>}
            <button className="w-full rounded-sm bg-navy px-6 py-3 text-sm font-medium text-white hover:bg-navy-dark">Log in</button>
          </form>
        </section>
      </Layout>
    );
  }

  const list = data.students.filter((s) =>
    `${s.name} ${s.email} ${s.studentId} ${title(s.course)}`.toLowerCase().includes(q.toLowerCase()));
  const avg = data.students.length ? Math.round(data.students.reduce((n, s) => n + s.progressPct, 0) / data.students.length) : 0;

  return (
    <Layout title="Admin — NexaDataEase Training">
      <section className="mx-auto max-w-6xl px-5 pb-20 pt-10 sm:px-8 sm:pt-14">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
          <h1 className="text-3xl font-semibold">Training admin</h1>
          <div className="flex gap-3">
            <button onClick={exportCsv} className="rounded-sm border border-line px-4 py-2 text-sm hover:bg-white">Export CSV</button>
            <button onClick={() => { clearToken(ADMIN_KEY); setData(null); }} className="rounded-sm border border-line px-4 py-2 text-sm hover:bg-white">Log out</button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="border-l-4 border-green bg-white p-5"><p className={label}>Students</p><p className="mt-2 text-2xl font-semibold">{data.students.length}</p></div>
          <div className="border-l-4 border-green bg-white p-5"><p className={label}>Average progress</p><p className="mt-2 text-2xl font-semibold">{avg}%</p></div>
          <div className="border-l-4 border-bronze bg-white p-5">
            <p className={label}>CBT</p>
            <p className="mt-2 text-2xl font-semibold">{data.cbtOpen ? "Open" : "Coming soon"}</p>
            <button onClick={toggleCbt} className="mt-2 text-sm text-navy underline">{data.cbtOpen ? "Close CBT" : "Open CBT to students"}</button>
          </div>
        </div>
        {err && <p className="mt-4 text-sm text-red-700" role="alert">{err}</p>}

        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, email, ID or program"
          className="mt-8 w-full border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-navy" />

        <div className="mt-4 overflow-x-auto bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-ink/45">
              <tr>{["Student ID", "Name", "Contact", "Program", "Progress", "CBT best", "Joined"].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-line">
              {list.map((s) => (
                <tr key={s.studentId}>
                  <td className="px-4 py-3 font-mono text-navy">{s.studentId}</td>
                  <td className="px-4 py-3">{s.name}</td>
                  <td className="px-4 py-3 text-ink/70">{s.email}<br />{s.phone}</td>
                  <td className="px-4 py-3">{title(s.course)}</td>
                  <td className="px-4 py-3">{s.progressPct}%</td>
                  <td className="px-4 py-3">{s.bestScore === null ? "—" : `${s.bestScore}% (${s.attempts})`}</td>
                  <td className="px-4 py-3 text-ink/60">{s.createdAt.slice(0, 10)}</td>
                </tr>
              ))}
              {!list.length && <tr><td colSpan={7} className="px-4 py-8 text-center text-ink/50">No students found.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
}