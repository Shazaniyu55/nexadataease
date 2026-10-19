import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../../../components/Layout";
import { Field, input, btn, CATS } from "../../../components/training/ui";
import { iapi, saveToken, INSTRUCTOR_KEY } from "../../../lib/trainingApi";
import { uploadFile, checkFile } from "../../../lib/cloudinaryUpload";

const QUALS = ["OND / HND", "Bachelor's degree", "Master's degree", "PhD", "Professional certification", "Bootcamp / self-taught"];

export default function InstructorRegister() {
  const router = useRouter();
  const [f, setF] = useState({ name: "", email: "", phone: "", password: "", country: "", qualification: QUALS[1], yearsExperience: "", employer: "", linkedin: "", teachingExperience: "", bio: "", expertise: [], consent: false });
  const [cv, setCv] = useState(null);
  const [certs, setCerts] = useState([]);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [created, setCreated] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const toggle = (v) => setF({ ...f, expertise: f.expertise.includes(v) ? f.expertise.filter((x) => x !== v) : [...f.expertise, v] });

  async function submit(e) {
    e.preventDefault(); setErr("");
    try {
      if (!cv) throw new Error("Please attach your CV.");
      checkFile(cv, "cv"); certs.forEach((c) => checkFile(c, "certificate")); // check files before creating the account
      setMsg("Creating your account…");
      const d = await iapi("/instructor/register", "POST", { ...f, yearsExperience: Number(f.yearsExperience) });
      saveToken(d.token, INSTRUCTOR_KEY); setCreated(true);
      const cvFile = await uploadFile(cv, "cv", (p) => setMsg(`Uploading CV… ${p}%`));
      const certFiles = [];
      for (const [i, c] of certs.entries()) { setMsg(`Uploading certificate ${i + 1}…`); certFiles.push(await uploadFile(c, "certificate")); }
      await iapi("/instructor/documents", "POST", { cv: cvFile, certificates: certFiles });
      router.push("/training/instructor/dashboard");
    } catch (x) { setErr(x.message); setMsg(""); }
  }

  return (
    <Layout title="Become an instructor — NexaDataEase Training">
      <section className="mx-auto max-w-2xl px-5 pb-20 pt-16 sm:px-8 sm:pt-24">
        <p className="text-xs uppercase tracking-wide text-ink/45">Instructor application</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight">Teach on NexaDataEase.</h1>
        <p className="mt-4 text-[15px] text-ink/70">Tell us about your background and attach your CV. Our team reviews every application before you can publish courses.</p>

        <form onSubmit={submit} className="mt-8 space-y-5 border-l-4 border-green bg-white p-6 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="name" text="Full name"><input id="name" required className={input} value={f.name} onChange={set("name")} autoComplete="name" /></Field>
            <Field id="email" text="Email"><input id="email" type="email" required className={input} value={f.email} onChange={set("email")} autoComplete="email" /></Field>
            <Field id="phone" text="Phone"><input id="phone" type="tel" required className={input} value={f.phone} onChange={set("phone")} autoComplete="tel" /></Field>
            <Field id="country" text="Country / city"><input id="country" required className={input} value={f.country} onChange={set("country")} /></Field>
            <Field id="qual" text="Highest qualification"><select id="qual" className={input} value={f.qualification} onChange={set("qualification")}>{QUALS.map((q) => <option key={q}>{q}</option>)}</select></Field>
            <Field id="yrs" text="Years of professional experience"><input id="yrs" type="number" min={0} max={60} required className={input} value={f.yearsExperience} onChange={set("yearsExperience")} /></Field>
            <Field id="emp" text="Current employer / role (optional)"><input id="emp" className={input} value={f.employer} onChange={set("employer")} /></Field>
            <Field id="li" text="LinkedIn / portfolio / GitHub (optional)"><input id="li" className={input} value={f.linkedin} onChange={set("linkedin")} /></Field>
          </div>

          <Field id="pw" text="Password"><input id="pw" type="password" required minLength={6} className={input} value={f.password} onChange={set("password")} autoComplete="new-password" /></Field>

          <div>
            <p className="text-xs uppercase tracking-wide text-ink/45">Areas you can teach</p>
            <div className="mt-3 flex flex-wrap gap-4">
              {CATS.map(([v, t]) => (
                <label key={v} className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-green" checked={f.expertise.includes(v)} onChange={() => toggle(v)} />{t}</label>
              ))}
            </div>
          </div>

          <Field id="teach" text="Teaching or mentoring experience (optional)"><textarea id="teach" rows={3} className={input} value={f.teachingExperience} onChange={set("teachingExperience")} /></Field>
          <Field id="bio" text="About you (at least 40 characters)"><textarea id="bio" required rows={4} className={input} value={f.bio} onChange={set("bio")} /></Field>

          <Field id="cv" text="CV / resume (PDF, DOC or DOCX, max 5 MB)"><input id="cv" type="file" required accept=".pdf,.doc,.docx" className={input} onChange={(e) => setCv(e.target.files[0] || null)} /></Field>
          <Field id="certs" text="Certificates (optional, up to 3)"><input id="certs" type="file" multiple accept=".pdf,.jpg,.jpeg,.png" className={input} onChange={(e) => setCerts([...e.target.files].slice(0, 3))} /></Field>

          <label className="flex items-start gap-3 text-sm"><input type="checkbox" required className="mt-1 accent-green" checked={f.consent} onChange={(e) => setF({ ...f, consent: e.target.checked })} />I confirm the information and documents I provide are accurate.</label>

          {msg && <p className="text-sm text-ink/65">{msg}</p>}
          {err && <p className="text-sm text-red-700" role="alert">{err}{created && <> Your account was created — <Link href="/training/instructor/dashboard" className="underline">continue here</Link> to upload your documents.</>}</p>}
          <button disabled={!!msg} className={`${btn} w-full`}>Submit application</button>
          <p className="text-sm text-ink/60">Already applied? <Link href="/training/instructor/login" className="text-navy underline">Log in</Link></p>
        </form>
      </section>
    </Layout>
  );
}