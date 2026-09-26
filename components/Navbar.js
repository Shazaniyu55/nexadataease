import { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Products" },
  { href: "/team", label: "Team" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-ink/80 transition-colors hover:text-navy"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="rounded-sm bg-green px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-dark"
          >
            Partner with us
          </Link>
        </nav>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-sm border border-line md:hidden"
        >
          {open ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M1 1L17 17M17 1L1 17" stroke="#12161D" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true">
              <path d="M0 1H18M0 7H18M0 13H18" stroke="#12161D" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <nav className="border-t border-line bg-paper px-5 pb-6 pt-2 md:hidden">
          <ul className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-sm px-2 py-3 text-base text-ink/85 hover:bg-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="block rounded-sm bg-green px-4 py-3 text-center text-sm font-medium text-white"
              >
                Partner with us
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
