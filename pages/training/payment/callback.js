import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../../../components/Layout";
import { api } from "../../../lib/trainingApi";

// Paystack sends the student back here with ?reference=... after paying.
export default function Callback() {
  const router = useRouter();
  const [state, setState] = useState({ s: "checking" });

  useEffect(() => {
    if (!router.isReady) return;
    const reference = router.query.reference || router.query.trxref;
    if (!reference) return setState({ s: "error", msg: "No payment reference found." });
    let tries = 0, stop = false;
    (async function check() {
      try {
        const d = await api("/payments/verify", "POST", { reference });
        if (d.status === "paid") return setState({ s: "paid", courseId: d.courseId });
        if (++tries < 4 && !stop) setTimeout(check, 2500); // bank confirmations can lag a few seconds
        else setState({ s: "pending" });
      } catch (e) { setState({ s: "error", msg: e.message }); }
    })();
    return () => { stop = true; };
  }, [router.isReady, router.query]);

  const { s } = state;
  return (
    <Layout title="Payment — NexaDataEase Training">
      <section className="mx-auto max-w-xl px-5 py-24 text-center sm:px-8">
        {s === "checking" && <p className="text-ink/70">Confirming your payment…</p>}
        {s === "paid" && (<>
          <h1 className="text-4xl font-semibold">Payment successful 🎉</h1>
          <p className="mt-3 text-ink/70">The course is now yours.</p>
          <Link href={`/training/learn/${state.courseId}`} className="mt-6 inline-block rounded-sm bg-navy px-6 py-3 text-sm text-white">Start learning</Link>
        </>)}
        {s === "pending" && (<>
          <h1 className="text-3xl font-semibold">We have not received confirmation yet</h1>
          <p className="mt-3 text-ink/70">If your account was debited, access is added automatically within a few minutes. Check <Link href="/training/dashboard" className="underline">My courses</Link> shortly.</p>
        </>)}
        {s === "error" && (<>
          <h1 className="text-3xl font-semibold">Something went wrong</h1>
          <p className="mt-3 text-ink/70">{state.msg} If you were charged, contact us with your payment reference.</p>
        </>)}
      </section>
    </Layout>
  );
}