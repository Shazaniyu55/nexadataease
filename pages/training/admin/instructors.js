import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Layout from "../../../components/Layout";
import { label, input, catName } from "../../../components/training/ui";
import { api, hasToken, ADMIN_KEY } from "../../../lib/trainingApi";

const STATUSES = ["pending", "incomplete", "approved", "rejected"];
const a = (p, m, b) => api(p, m, b, ADMIN_KEY);

export default function AdminInstructors() {
  const [status, setStatus] = useState("pending");
  const [list, setList] = useState(null);
  const [sel, setSel] = useState(null);
  const [note, setNote] = useState("");
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    try { setList(await a(`/admin/instructors?status=${status}`)); setErr(""); } catch (e) { setErr(e.message); }
  }, [status]);
  useEffect(() => { if (hasToken(ADMIN_KEY)) load(); }, [load]);

  async function open(id) { setNote(""); setErr(""); try { setSel(await a(`/admin/instructors/${id}`)); } catch (e) { setErr(e.message); } }
  async function review(decision) {
    try { await a(`/admin/instructors/${sel._id}/review`, "POST", { decision, note }); setSel(null); load(); } catch (e) { setErr(e.message); }
  }

  if (!hasToken(ADMIN_KEY)) return (
    <Layout title="Instructors — Admin"><p className="mx-auto max-w-6xl px-5 py-24 text-sm sm:px-8">Please <Link href="/training/admin" className="underline">log in as admin</Link> first.</p></Layout>
  );

  return (
    <Layout title="Instructor applications — Admin">
      <section className="mx-auto max-w-6xl px-5 pb-20 pt-10 sm:px-8 sm:pt-14">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
          <h1 className="text-3xl font-semibold">Instructor applications</h1>
          <Link href="/training/admin" className="rounded-sm border border-line px-4 py-2 text-sm hover:bg-white">← Students</Link>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button key={s} onClick={() => { setStatus(s); setSel(null); }} className={`rounded-sm px-4 py-2 text-sm capitalize ${status === s ? "bg-navy text-white" : "bg-white text-ink/75"}`}>{s}</button>
          ))}
        </div>
        {err && <p className="mt-4 text-sm text-red-700" role="alert">{err}</p>}

        <div className="mt-6 grid gap-6 md:grid-cols-[320px_1fr]">
          <ul className="divide-y divide-line bg-white">
            {(list || []).map((i) => (
              <li key={i._id}>
                <button onClick={() => open(i._id)} className={`w-full px-4 py-3 text-left text-sm hover:bg-paper ${sel && sel._id === i._id ? "bg-paper" : ""}`}>
                  <span className="block font-medium">{i.name}</span>
                  <span className="text-ink/60">{i.email} · {i.yearsExperience} yrs</span>
                </button>
              </li>
            ))}
            {list && !list.length && <li className="px-4 py-8 text-center text-sm text-ink/50">No {status} applications.</li>}
          </ul>

          {sel && (
            <div className="space-y-4 bg-white p-6 text-sm">
              <div className="flex items-start justify-between gap-3">
                <div><h2 className="text-xl font-semibold">{sel.name}</h2><p className="text-ink/60">{sel.email} · {sel.phone} · {sel.country}</p></div>
                <span className="rounded-sm bg-paper px-3 py-1 text-xs uppercase tracking-wide">{sel.status}</span>
              </div>
              <dl className="grid gap-3 sm:grid-cols-2">
                <div><dt className={label}>Qualification</dt><dd className="mt-1">{sel.qualification}</dd></div>
                <div><dt className={label}>Experience</dt><dd className="mt-1">{sel.yearsExperience} years{sel.employer ? ` · ${sel.employer}` : ""}</dd></div>
                <div><dt className={label}>Can teach</dt><dd className="mt-1">{(sel.expertise || []).map(catName).join(", ")}</dd></div>
                <div><dt className={label}>Profile link</dt><dd className="mt-1">{sel.linkedin ? <a href={sel.linkedin} target="_blank" rel="noopener noreferrer" className="text-navy underline">{sel.linkedin}</a> : "—"}</dd></div>
              </dl>
              <div><p className={label}>About</p><p className="mt-1 whitespace-pre-wrap">{sel.bio}</p></div>
              {sel.teachingExperience && <div><p className={label}>Teaching experience</p><p className="mt-1 whitespace-pre-wrap">{sel.teachingExperience}</p></div>}
              <div>
                <p className={label}>Documents (links expire in 1 hour)</p>
                <div className="mt-2 flex flex-wrap gap-3">
                  {sel.cvUrl ? <a href={sel.cvUrl} target="_blank" rel="noopener noreferrer" className="rounded-sm border border-line px-4 py-2 hover:bg-paper">Download CV</a> : <span className="text-ink/50">No CV uploaded yet</span>}
                  {sel.certificateUrls.map((c, n) => <a key={n} href={c.url} target="_blank" rel="noopener noreferrer" className="rounded-sm border border-line px-4 py-2 hover:bg-paper">{c.name || `Certificate ${n + 1}`}</a>)}
                </div>
              </div>
              {sel.reviewNote && <p className="text-ink/60">Previous note: {sel.reviewNote}</p>}
              {sel.status !== "incomplete" && (
                <div className="border-t border-line pt-4">
                  <label className={label} htmlFor="note">Note to applicant (required if rejecting)</label>
                  <textarea id="note" rows={3} className={input} value={note} onChange={(e) => setNote(e.target.value)} />
                  <div className="mt-3 flex gap-3">
                    <button onClick={() => review("approved")} className="rounded-sm bg-green px-5 py-2.5 text-white hover:bg-green-dark">Approve</button>
                    <button onClick={() => review("rejected")} className="rounded-sm border border-line px-5 py-2.5 hover:bg-paper">Reject</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}