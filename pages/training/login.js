import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../../components/Layout";
import { api, saveToken } from "../../lib/trainingApi";

const input = "mt-2 w-full border border-line bg-paper px-3 py-2.5 text-sm outline-none focus:border-navy";
const label = "text-xs uppercase tracking-wide text-ink/45";

export default function Login() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      const d = await api("/login", "POST", { login, password });
      saveToken(d.token);
      router.push("/training/dashboard");
    } catch (x) { setErr(x.message); setBusy(false); }
  }

  return (
    <Layout title="Student login — NexaDataEase Training">
      <section className="mx-auto max-w-xl px-5 pb-20 pt-16 sm:px-8 sm:pt-24">
        <p className="text-xs uppercase tracking-wide text-ink/45">Student login</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight">Welcome back.</h1>

        <form onSubmit={submit} className="mt-8 space-y-5 border-l-4 border-green bg-white p-6 sm:p-8">
          <div><label className={label} htmlFor="login">Email or student ID</label>
            <input id="login" required className={input} placeholder="NXD-2026-0001" value={login} onChange={(e) => setLogin(e.target.value)} /></div>
          <div><label className={label} htmlFor="password">Password</label>
            <input id="password" type="password" required className={input} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" /></div>
          {err && <p className="text-sm text-red-700" role="alert">{err}</p>}
          <button disabled={busy} className="w-full rounded-sm bg-navy px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-navy-dark disabled:opacity-60">
            {busy ? "Logging in…" : "Log in"}
          </button>
        <p className="text-sm text-ink/60">
            New here? <Link href="/training/register" className="text-navy underline">Register</Link>
            {" · "}<Link href="/training/forgot" className="text-navy underline">Forgot password?</Link>
          </p>
        </form>
      </section>
    </Layout>
  );
}