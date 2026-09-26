import Image from "next/image";
import logoIcon from "../public/images/logo-icon.png";

export default function Logo({ dark = false, className = "" }) {
  const textColor = dark ? "text-white" : "text-ink";
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Image src={logoIcon} alt="" aria-hidden="true" className="h-8 w-auto" priority />
      <span className={`font-display text-xl font-semibold tracking-tight ${textColor}`}>
        Nexa<span className="text-green">DataEase</span>
      </span>
    </span>
  );
}
