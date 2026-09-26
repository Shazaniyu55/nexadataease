export default function ImagePlaceholder({ label = "Add photo", ratio = "aspect-[4/3]", className = "" }) {
  return (
    <div
      className={`flex ${ratio} w-full flex-col items-center justify-center gap-2 border border-dashed border-ink/25 bg-white/60 text-center ${className}`}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="2" y="4" width="20" height="16" rx="1.5" stroke="#12161D" strokeOpacity="0.35" strokeWidth="1.4" />
        <circle cx="8" cy="10" r="1.6" stroke="#12161D" strokeOpacity="0.35" strokeWidth="1.4" />
        <path d="M2.8 17L8.5 12.5L12.5 15.5L16 12L21.2 17" stroke="#12161D" strokeOpacity="0.35" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
      <span className="max-w-[16rem] px-4 text-xs text-ink/45">{label}</span>
    </div>
  );
}
