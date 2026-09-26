import Link from "next/link";
import Image from "next/image";
import ImagePlaceholder from "./ImagePlaceholder";

const ACCENTS = {
  green: "border-green",
  navy: "border-navy",
  bronze: "border-bronze",
};

export default function ProductPanel({
  accent = "green",
  eyebrow,
  name,
  status,
  description,
  points = [],
  image,
  imageAlt = "",
  detailHref,
  appUrl = "#",
}) {
  return (
    <div className={`grid gap-0 overflow-hidden border-l-4 bg-white sm:grid-cols-[minmax(0,15rem)_1fr] ${ACCENTS[accent]}`}>
      <div className="relative aspect-[4/3] sm:aspect-auto sm:h-full">
        {image ? (
          <Image src={image} alt={imageAlt} fill sizes="(min-width: 640px) 15rem, 100vw" className="object-cover" />
        ) : (
          <ImagePlaceholder label={`${name} screenshot — add when ready`} ratio="h-full" />
        )}
      </div>

      <div className="px-6 py-7 sm:px-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-sm text-ink/55">{eyebrow}</p>
          {status && <span className="text-xs text-ink/45">{status}</span>}
        </div>

        {detailHref ? (
          <Link href={detailHref} className="mt-1 inline-block text-2xl font-semibold hover:text-green sm:text-[28px]">
            {name}
          </Link>
        ) : (
          <h3 className="mt-1 text-2xl font-semibold sm:text-[28px]">{name}</h3>
        )}

        <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-ink/70">
          {description}
        </p>

        {points.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink/60">
            {points.map((point) => (
              <li key={point} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-ink/40" />
                {point}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
          {detailHref && (
            <Link href={detailHref} className="text-navy underline decoration-line underline-offset-4 hover:decoration-navy">
              View details
            </Link>
          )}
          <a href={appUrl} target="_blank" rel="noreferrer" className="text-green underline decoration-line underline-offset-4 hover:decoration-green">
            Visit {name}
          </a>
        </div>
      </div>
    </div>
  );
}
