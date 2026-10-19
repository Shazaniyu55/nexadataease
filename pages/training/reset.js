import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../../components/Layout";
import { api } from "../../lib/trainingApi";

export default function Reset() {
  const router = useRouter();
  const { email, token } = router.query;
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr(""); setBusy(true);
    try { await api("/reset", "POST", { email, token, password }); setDone(true); }
    catch (x) { setErr(x.message); }
    setBusy(false);
  }

  return (
    <Layout title="Reset password — NexaDataEase Training">
      <section className="mx-auto max-w-xl px-5 pb-20 pt-16 sm:px-8 sm:pt-24">
        <p className="text-xs uppercase tracking-wide text-ink/45">Password reset</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight">Choose a new password.</h1>
        <div className="mt-8 border-l-4 border-green bg-white p-6 sm:p-8">
          {done ? (
            <p className="text-[15px] text-ink/75">Password updated. <Link href="/training/login" className="text-navy underline">Log in</Link></p>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <div>
                <label htmlFor="pw" className="text-xs uppercase tracking-wide text-ink/45">New password</label>
                <input id="pw" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password" className="mt-2 w-full border border-line bg-paper px-3 py-2.5 text-sm outline-none focus:border-navy" />
              </div>
              {err && <p className="text-sm text-red-700" role="alert">{err}</p>}
              <button disabled={busy || !email || !token} className="w-full rounded-sm bg-navy px-6 py-3 text-sm font-medium text-white hover:bg-navy-dark disabled:opacity-60">
                {busy ? "Saving…" : "Update password"}
              </button>
            </form>
          )}
        </div>
      </section>
    </Layout>
  );
}