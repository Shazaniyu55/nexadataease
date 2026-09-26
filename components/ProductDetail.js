import Image from "next/image";
import Layout from "./Layout";
import ImagePlaceholder from "./ImagePlaceholder";

export default function ProductDetail({
  eyebrow,
  name,
  status,
  tagline,
  description,
  features = [],
  screenshots = [],
  appUrl = "#",
  accent = "green",
}) {
  const accentText = { green: "text-green", navy: "text-navy", bronze: "text-bronze" }[accent];
  const accentBg = { green: "bg-green hover:bg-green-dark", navy: "bg-navy hover:bg-navy-dark", bronze: "bg-bronze hover:opacity-90" }[accent];

  return (
    <Layout title={`${name} — NexaDataEase`} description={tagline}>
      <section className="mx-auto max-w-6xl px-5 pb-10 pt-16 sm:px-8 sm:pt-24">
        <p className={`text-xs uppercase tracking-wide ${accentText}`}>{eyebrow}</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">{name}</h1>
          {status && <span className="text-sm text-ink/45">{status}</span>}
        </div>
        <p className="mt-4 max-w-prose text-lg leading-relaxed text-ink/70">{tagline}</p>

        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href={appUrl}
            target="_blank"
            rel="noreferrer"
            className={`rounded-sm px-6 py-3 text-sm font-medium text-white transition-colors ${accentBg}`}
          >
            Visit {name}
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
        {screenshots.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-3">
            {screenshots.map((src, i) => (
              <div key={i} className="relative aspect-[4/3] overflow-hidden border border-line">
                <Image src={src} alt={`${name} screenshot ${i + 1}`} fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <ImagePlaceholder key={i} label={`${name} screenshot ${i} — add when ready`} />
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-line bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <p className="text-xs uppercase tracking-wide text-ink/45">What it does</p>
          <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-ink/75">{description}</p>

          {features.length > 0 && (
            <ul className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {features.map((f) => (
                <li key={f} className={`border-l-2 pl-4 text-sm text-ink/70 ${{ green: "border-green", navy: "border-navy", bronze: "border-bronze" }[accent]}`}>
                  {f}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </Layout>
  );
}
