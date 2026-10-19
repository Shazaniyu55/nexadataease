import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../../components/Layout";
import { COURSES } from "../../lib/courses";
import { api, saveToken, safeNext } from "../../lib/trainingApi";

const input = "mt-2 w-full border border-line bg-paper px-3 py-2.5 text-sm outline-none focus:border-navy";
const label = "text-xs uppercase tracking-wide text-ink/45";

export default function Register() {
  const router = useRouter();
  const [f, setF] = useState({ name: "", email: "", phone: "", course: COURSES[0].id, password: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  useEffect(() => {
    const c = router.query.course;
    if (c && COURSES.some((x) => x.id === c)) setF((p) => ({ ...p, course: c }));
  }, [router.query.course]);

  async function submit(e) {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      const d = await api("/register", "POST", f);
      saveToken(d.token);
router.push(safeNext(router.query.next));    } catch (x) { setErr(x.message); setBusy(false); }
  }

  return (
    <Layout title="Student registration — NexaDataEase Training">
      <section className="mx-auto max-w-xl px-5 pb-20 pt-16 sm:px-8 sm:pt-24">
        <p className="text-xs uppercase tracking-wide text-ink/45">Student registration</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight">Join the program.</h1>
        <p className="mt-4 text-[15px] text-ink/70">You will get a unique student ID as soon as you register.</p>

        <form onSubmit={submit} className="mt-8 space-y-5 border-l-4 border-green bg-white p-6 sm:p-8">
          <div><label className={label} htmlFor="name">Full name</label>
            <input id="name" required className={input} value={f.name} onChange={set("name")} autoComplete="name" /></div>
          <div><label className={label} htmlFor="email">Email</label>
            <input id="email" type="email" required className={input} value={f.email} onChange={set("email")} autoComplete="email" /></div>
          <div><label className={label} htmlFor="phone">Phone</label>
            <input id="phone" type="tel" className={input} value={f.phone} onChange={set("phone")} autoComplete="tel" /></div>
          <div><label className={label} htmlFor="course">Program</label>
            <select id="course" className={input} value={f.course} onChange={set("course")}>
              {COURSES.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select></div>
          <div><label className={label} htmlFor="password">Password</label>
            <input id="password" type="password" required minLength={6} className={input} value={f.password} onChange={set("password")} autoComplete="new-password" /></div>
          {err && <p className="text-sm text-red-700" role="alert">{err}</p>}
          <button disabled={busy} className="w-full rounded-sm bg-navy px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-navy-dark disabled:opacity-60">
            {busy ? "Creating account…" : "Create account"}
          </button>
          <p className="text-sm text-ink/60">Already registered? <Link href="/training/login" className="text-navy underline">Log in</Link></p>
        </form>
      </section>
    </Layout>
  );
}