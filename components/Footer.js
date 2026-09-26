import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-navy text-white">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <Logo dark />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/65">
              A Nigerian technology company building payments, mobility and
              financial infrastructure for everyday people.
            </p>
            <p className="mt-4 text-xs uppercase tracking-wide text-white/45">
              Registered with the Corporate Affairs Commission (CAC), Nigeria
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-white/45">Company</p>
            <ul className="mt-3 space-y-2 text-sm text-white/75">
              <li><Link href="/about" className="hover:text-white">About us</Link></li>
              <li><Link href="/projects" className="hover:text-white">Products</Link></li>
              <li><Link href="/team" className="hover:text-white">Team</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-white/45">Get in touch</p>
            <ul className="mt-3 space-y-2 text-sm text-white/75">
              <li>
                <a href="mailto:info@nexadataease.com" className="hover:text-white">
                  info@nexadataease.com
                </a>
              </li>
              <li className="text-white/50">10 Kunene Street, Maitama, Maitama, 904101, Nigeria</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} NexaDataEase Limited. All rights reserved.</p>
          <p>RC number on request — CAC registered</p>
        </div>
      </div>
    </footer>
  );
}
