import Link from "next/link";

export const input = "mt-2 w-full border border-line bg-paper px-3 py-2.5 text-sm outline-none focus:border-navy";
export const label = "text-xs uppercase tracking-wide text-ink/45";
export const btn = "rounded-sm bg-navy px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-navy-dark disabled:opacity-60";
export const money = (n) => `₦${Number(n).toLocaleString("en-NG")}`;
export const CATS = [["web", "Web development"], ["data", "Data analysis"], ["mobile", "Mobile development"], ["uiux", "UI/UX design"], ["other", "Other"]];
export const catName = (id) => (CATS.find((c) => c[0] === id) || [])[1] || id;

export function Field({ id, text, children }) {
  return (<div><label className={label} htmlFor={id}>{text}</label>{children}</div>);
}

export function CourseCard({ c, href, action }) {
  return (
    <Link href={href} className="flex flex-col border-l-4 border-green bg-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {c.thumbnail ? <img src={c.thumbnail} alt="" className="aspect-video w-full object-cover" /> : <div className="aspect-video w-full bg-line" />}
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs uppercase tracking-wide text-bronze">{catName(c.category)} · {c.level}</p>
        <h3 className="mt-2 text-lg font-semibold">{c.title}</h3>
        <p className="mt-1 text-sm text-ink/60">{c.instructor ? `by ${c.instructor} · ` : ""}{c.lessonCount} lesson{c.lessonCount === 1 ? "" : "s"}</p>
        <p className="mt-auto pt-4 font-semibold text-navy">{action || money(c.price)}</p>
      </div>
    </Link>
  );
}