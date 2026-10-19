import { useState } from "react";
import Link from "next/link";
import Layout from "../../components/Layout";
import { api } from "../../lib/trainingApi";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr(""); setBusy(true);
    try { await api("/forgot", "POST", { email }); setSent(true); }
    catch (x) { setErr(x.message); }
    setBusy(false);
  }

  return (
    <Layout title="Forgot password — NexaDataEase Training">
      <section className="mx-auto max-w-xl px-5 pb-20 pt-16 sm:px-8 sm:pt-24">
        <p className="text-xs uppercase tracking-wide text-ink/45">Password reset</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight">Forgot your password?</h1>
        <div className="mt-8 border-l-4 border-green bg-white p-6 sm:p-8">
          {sent ? (
            <p className="text-[15px] text-ink/75">If that email is registered, a reset link is on its way. It is valid for one hour.</p>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <div>
                <label htmlFor="email" className="text-xs uppercase tracking-wide text-ink/45">Your email</label>
                <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full border border-line bg-paper px-3 py-2.5 text-sm outline-none focus:border-navy" />
              </div>
              {err && <p className="text-sm text-red-700" role="alert">{err}</p>}
              <button disabled={busy} className="w-full rounded-sm bg-navy px-6 py-3 text-sm font-medium text-white hover:bg-navy-dark disabled:opacity-60">
                {busy ? "Sending…" : "Send reset link"}
              </button>
            </form>
          )}
          <p className="mt-5 text-sm text-ink/60"><Link href="/training/login" className="text-navy underline">Back to login</Link></p>
        </div>
      </section>
    </Layout>
  );
}