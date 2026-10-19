import { useState } from "react";
import { iapi } from "../../lib/trainingApi";
import { uploadFile, checkFile } from "../../lib/cloudinaryUpload";
import { Field, input, btn } from "./ui";

// Upload CV (+ optional certificates) and submit the application for review.
export default function InstructorDocs({ onDone }) {
  const [cv, setCv] = useState(null);
  const [certs, setCerts] = useState([]);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault(); setErr("");
    try {
      if (!cv) throw new Error("Please attach your CV.");
      checkFile(cv, "cv"); certs.forEach((c) => checkFile(c, "certificate"));
      setMsg("Uploading CV…");
      const cvFile = await uploadFile(cv, "cv", (p) => setMsg(`Uploading CV… ${p}%`));
      const certFiles = [];
      for (const [i, c] of certs.entries()) { setMsg(`Uploading certificate ${i + 1}…`); certFiles.push(await uploadFile(c, "certificate")); }
      await iapi("/instructor/documents", "POST", { cv: cvFile, certificates: certFiles });
      onDone();
    } catch (x) { setErr(x.message); }
    setMsg("");
  }

  return (
    <form onSubmit={submit} className="space-y-5 border-l-4 border-green bg-white p-6">
      <Field id="cv" text="CV / resume (PDF, DOC or DOCX, max 5 MB)">
        <input id="cv" type="file" accept=".pdf,.doc,.docx" className={input} onChange={(e) => setCv(e.target.files[0] || null)} />
      </Field>
      <Field id="certs" text="Certificates (optional, up to 3: PDF, JPG or PNG)">
        <input id="certs" type="file" multiple accept=".pdf,.jpg,.jpeg,.png" className={input} onChange={(e) => setCerts([...e.target.files].slice(0, 3))} />
      </Field>
      {msg && <p className="text-sm text-ink/65">{msg}</p>}
      {err && <p className="text-sm text-red-700" role="alert">{err}</p>}
      <button disabled={!!msg} className={btn}>Submit for review</button>
    </form>
  );
}