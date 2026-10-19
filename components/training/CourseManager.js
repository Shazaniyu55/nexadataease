import { useCallback, useEffect, useState } from "react";
import { iapi } from "../../lib/trainingApi";
import { uploadFile, checkFile } from "../../lib/cloudinaryUpload";
import { Field, input, btn, money, CATS, catName } from "./ui";

function NewCourse({ onDone }) {
  const [f, setF] = useState({ title: "", description: "", category: "web", level: "beginner", price: "" });
  const [thumb, setThumb] = useState(null);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault(); setErr("");
    try {
      let thumbnail = null;
      if (thumb) { checkFile(thumb, "thumbnail"); thumbnail = await uploadFile(thumb, "thumbnail", (p) => setMsg(`Uploading thumbnail… ${p}%`)); }
      setMsg("Saving…");
      await iapi("/instructor/courses", "POST", { ...f, price: Number(f.price), thumbnail });
      onDone();
    } catch (x) { setErr(x.message); }
    setMsg("");
  }

  return (
    <form onSubmit={submit} className="space-y-4 border-l-4 border-green bg-white p-6">
      <Field id="ct" text="Course title"><input id="ct" required className={input} value={f.title} onChange={set("title")} /></Field>
      <Field id="cd" text="Description"><textarea id="cd" required rows={4} className={input} value={f.description} onChange={set("description")} /></Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field id="cc" text="Category"><select id="cc" className={input} value={f.category} onChange={set("category")}>{CATS.map(([v, t]) => <option key={v} value={v}>{t}</option>)}</select></Field>
        <Field id="cl" text="Level"><select id="cl" className={input} value={f.level} onChange={set("level")}>{["beginner", "intermediate", "advanced"].map((v) => <option key={v}>{v}</option>)}</select></Field>
        <Field id="cp" text="Price (₦, min 500)"><input id="cp" type="number" required min={500} step={1} className={input} value={f.price} onChange={set("price")} /></Field>
      </div>
      <Field id="cth" text="Thumbnail (JPG, PNG or WEBP, max 5 MB, 16:9 looks best)">
        <input id="cth" type="file" accept=".jpg,.jpeg,.png,.webp" className={input} onChange={(e) => setThumb(e.target.files[0] || null)} />
      </Field>
      {msg && <p className="text-sm text-ink/65">{msg}</p>}
      {err && <p className="text-sm text-red-700" role="alert">{err}</p>}
      <button disabled={!!msg} className={btn}>Create course</button>
    </form>
  );
}

function CourseRow({ c, reload }) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function act(fn) { setErr(""); try { await fn(); await reload(); } catch (x) { setErr(x.message); } }
  async function addLesson(e) {
    e.preventDefault();
    const form = e.currentTarget;
    await act(async () => {
      try {
        if (!file) throw new Error("Choose a video or PDF for this lesson.");
        checkFile(file, "lesson");
        const up = await uploadFile(file, "lesson", (p) => setMsg(`Uploading… ${p}%`));
        await iapi(`/instructor/courses/${c.id}/lessons`, "POST", { title, file: up });
        setTitle(""); setFile(null); form.reset();
      } finally { setMsg(""); }
    });
  }

  return (
    <div className="bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold">{c.title}</h3>
          <p className="mt-1 text-sm text-ink/60">{catName(c.category)} · {c.level} · {money(c.price)} · {c.sales} sale{c.sales === 1 ? "" : "s"} · earned {money(c.earnings)}</p>
        </div>
        <button onClick={() => act(() => iapi(`/instructor/courses/${c.id}/publish`, "POST", { published: !c.published }))}
          className={`rounded-sm px-4 py-2 text-sm ${c.published ? "border border-line" : "bg-green text-white"}`}>
          {c.published ? "Unpublish" : "Publish"}
        </button>
      </div>
      <p className="mt-2 text-xs uppercase tracking-wide text-bronze">{c.published ? "Live in the catalogue" : "Draft — not visible to students"}</p>

      <ul className="mt-4 divide-y divide-line text-sm">
        {c.lessons.map((l, i) => (
          <li key={l.id} className="flex items-center justify-between py-2.5">
            <span>{i + 1}. {l.title} <span className="text-ink/45">({l.name})</span></span>
            <button onClick={() => act(() => iapi(`/instructor/courses/${c.id}/lessons/${l.id}`, "DELETE"))} className="text-red-700 underline">Remove</button>
          </li>
        ))}
        {!c.lessons.length && <li className="py-2.5 text-ink/50">No lessons yet.</li>}
      </ul>

      <form onSubmit={addLesson} className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <input required placeholder="Lesson title" className={input} value={title} onChange={(e) => setTitle(e.target.value)} />
        <input type="file" accept=".mp4,.mov,.webm,.m4v,.pdf" className={input} onChange={(e) => setFile(e.target.files[0] || null)} />
        <button disabled={!!msg} className={`${btn} mt-2`}>{msg || "Add lesson"}</button>
      </form>
      {err && <p className="mt-3 text-sm text-red-700" role="alert">{err}</p>}
    </div>
  );
}

export default function CourseManager() {
  const [data, setData] = useState(null);
  const [adding, setAdding] = useState(false);
  const [err, setErr] = useState("");
  const load = useCallback(async () => {
    try { setData(await iapi("/instructor/courses")); } catch (e) { setErr(e.message); }
  }, []);
  useEffect(() => { load(); }, [load]);

  if (!data) return <p className="text-sm text-ink/60">{err || "Loading…"}</p>;
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="border-l-4 border-green bg-white p-5"><p className="text-xs uppercase tracking-wide text-ink/45">Your earnings</p><p className="mt-2 text-2xl font-semibold">{money(data.totalEarnings)}</p></div>
        <div className="border-l-4 border-green bg-white p-5"><p className="text-xs uppercase tracking-wide text-ink/45">Your share</p><p className="mt-2 text-2xl font-semibold">{100 - data.feePercent}%</p></div>
        <div className="border-l-4 border-bronze bg-white p-5"><p className="text-xs uppercase tracking-wide text-ink/45">Courses</p><p className="mt-2 text-2xl font-semibold">{data.courses.length}</p></div>
      </div>
      <p className="text-sm text-ink/60">Earnings are paid out by NexaDataEase. Contact us to arrange payout details.</p>

      {adding ? <NewCourse onDone={() => { setAdding(false); load(); }} />
        : <button onClick={() => setAdding(true)} className={btn}>+ New course</button>}
      {data.courses.map((c) => <CourseRow key={c.id} c={c} reload={load} />)}
    </div>
  );
}