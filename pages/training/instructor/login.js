import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../../../components/Layout";
import { Field, input, btn } from "../../../components/training/ui";
import { iapi, saveToken, INSTRUCTOR_KEY } from "../../../lib/trainingApi";

export default function InstructorLogin() {
  const router = useRouter();
  const [f, setF] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault(); setErr(""); setBusy(true);
    try {
      const d = await iapi("/instructor/login", "POST", f);
      saveToken(d.token, INSTRUCTOR_KEY);
      router.push("/training/instructor/dashboard");
    } catch (x) { setErr(x.message); setBusy(false); }
  }

  return (
    <Layout title="Instructor login — NexaDataEase Training">
      <section className="mx-auto max-w-xl px-5 pb-20 pt-16 sm:px-8 sm:pt-24">
        <p className="text-xs uppercase tracking-wide text-ink/45">Instructor login</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight">Welcome back.</h1>
        <form onSubmit={submit} className="mt-8 space-y-5 border-l-4 border-green bg-white p-6 sm:p-8">
          <Field id="e" text="Email"><input id="e" type="email" required className={input} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></Field>
          <Field id="p" text="Password"><input id="p" type="password" required className={input} value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></Field>
          {err && <p className="text-sm text-red-700" role="alert">{err}</p>}
          <button disabled={busy} className={`${btn} w-full`}>{busy ? "Logging in…" : "Log in"}</button>
          <p className="text-sm text-ink/60">Want to teach? <Link href="/training/instructor/register" className="text-navy underline">Apply</Link></p>
        </form>
      </section>
    </Layout>
  );
}