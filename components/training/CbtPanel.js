import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../../lib/trainingApi";

const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export default function CbtPanel() {
  const [info, setInfo] = useState(null);
  const [test, setTest] = useState(null); // { deadline, questions }
  const [answers, setAnswers] = useState([]);
  const [left, setLeft] = useState(0);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");
  const answersRef = useRef([]);
  const busy = useRef(false);

  const load = useCallback(async () => {
    try { const d = await api("/cbt"); setInfo(d); if (d.active) setTest(d.active); }
    catch (e) { setErr(e.message); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const submit = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    try {
      setResult(await api("/cbt/submit", "POST", { answers: answersRef.current }));
      setTest(null); setAnswers([]); answersRef.current = [];
      await load();
    } catch (e) { setErr(e.message); }
    busy.current = false;
  }, [load]);

  useEffect(() => {
    if (!test) return;
    const tick = () => {
      const s = Math.max(0, Math.ceil((test.deadline - Date.now()) / 1000));
      setLeft(s);
      if (s === 0) submit(); // time is up: auto-submit
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [test, submit]);

  async function start() {
    setErr(""); setResult(null);
    try { setTest(await api("/cbt/start", "POST")); } catch (e) { setErr(e.message); }
  }
  const pick = (qi, oi) => {
    const next = [...answersRef.current]; next[qi] = oi;
    answersRef.current = next; setAnswers(next);
  };

  if (!info) return <p className="text-sm text-ink/60">{err || "Loading…"}</p>;

  if (test) {
    return (
      <div className="bg-white p-6">
        <div className="sticky top-16 z-10 -mx-6 -mt-6 mb-4 flex items-center justify-between border-b border-line bg-white px-6 py-3">
          <p className="text-sm text-ink/65">{answers.filter((a) => a !== undefined).length} of {test.questions.length} answered</p>
          <p className={`font-mono text-lg ${left < 60 ? "text-red-700" : "text-navy"}`}>{mmss(left)}</p>
        </div>
        {test.questions.map((q, qi) => (
          <fieldset key={qi} className="border-b border-line py-5 last:border-0">
            <legend className="font-medium">{qi + 1}. {q.q}</legend>
            <div className="mt-3 space-y-2">
              {q.options.map((o, oi) => (
                <label key={oi} className={`flex cursor-pointer items-center gap-3 border px-3 py-2.5 text-sm ${answers[qi] === oi ? "border-navy bg-paper" : "border-line"}`}>
                  <input type="radio" name={`q${qi}`} checked={answers[qi] === oi} onChange={() => pick(qi, oi)} className="accent-green" />
                  {o}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        {err && <p className="mt-3 text-sm text-red-700" role="alert">{err}</p>}
        <button onClick={submit} className="mt-4 w-full rounded-sm bg-green px-6 py-3 text-sm font-medium text-white hover:bg-green-dark">
          Submit test
        </button>
      </div>
    );
  }

  const used = info.attempts.length;
  return (
    <div className="space-y-5">
      {result && (
        <div className={`border-l-4 bg-white p-6 ${result.passed ? "border-green" : "border-bronze"}`}>
          <p className="text-xs uppercase tracking-wide text-ink/45">Your result</p>
          <p className="mt-2 text-3xl font-semibold">{result.score} / {result.total} <span className="text-lg text-ink/50">({result.pct}%)</span></p>
          <p className="mt-1 text-sm text-ink/70">{result.passed ? "Passed — well done!" : `Pass mark is ${info.passMark}%. Keep learning and try again.`}</p>
        </div>
      )}

      {!info.open ? (
        <div className="border-l-4 border-bronze bg-white p-8 text-center sm:p-14">
          <p className="text-xs uppercase tracking-wide text-bronze">Computer-based test</p>
          <h2 className="mt-3 text-3xl font-semibold">Coming soon</h2>
          <p className="mx-auto mt-3 max-w-prose text-[15px] text-ink/65">The CBT for your program has not opened yet. We will announce when it does.</p>
          <button disabled className="mt-6 cursor-not-allowed rounded-sm bg-navy px-6 py-3 text-sm font-medium text-white opacity-50">Start test</button>
        </div>
      ) : (
        <div className="bg-white p-6">
          <h2 className="text-2xl font-semibold">Computer-based test</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ink/70">
            <li>{info.minutes} minutes. The timer keeps running if you leave the page.</li>
            <li>Pass mark: {info.passMark}%. Attempts used: {used} of {info.maxAttempts}.</li>
          </ul>
          {err && <p className="mt-3 text-sm text-red-700" role="alert">{err}</p>}
          <button onClick={start} disabled={used >= info.maxAttempts}
            className="mt-5 rounded-sm bg-navy px-6 py-3 text-sm font-medium text-white hover:bg-navy-dark disabled:cursor-not-allowed disabled:opacity-50">
            {used >= info.maxAttempts ? "No attempts left" : "Start test"}
          </button>
        </div>
      )}

      {used > 0 && (
        <div className="bg-white p-6">
          <p className="text-xs uppercase tracking-wide text-ink/45">Past attempts</p>
          <ul className="mt-3 divide-y divide-line text-sm">
            {info.attempts.map((a, i) => (
              <li key={i} className="flex justify-between py-2.5">
                <span>Attempt {i + 1} · {new Date(a.date).toLocaleDateString()}</span>
                <span className={a.passed ? "text-green-dark" : "text-ink/60"}>{a.score}/{a.total} ({a.pct}%)</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}