import Link from "next/link";
import { ArrowRight, Link as LinkIcon, Mail } from "lucide-react";

export function RoveLogo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-lg font-black text-white shadow-lg shadow-blue-600/20">
        R
      </span>
      <span className="text-xl font-black tracking-tight text-slate-950">
        ROVE
      </span>
    </Link>
  );
}

export function CareersHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8">
        <RoveLogo href="/careers" />
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <Link href="/careers#about" className="transition hover:text-blue-600">
            About
          </Link>
          <Link href="/careers#benefits" className="transition hover:text-blue-600">
            Benefits
          </Link>
          <Link href="/careers#open-positions" className="transition hover:text-blue-600">
            Open roles
          </Link>
        </nav>
        <Link
          href="/careers#open-positions"
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-blue-600"
        >
          View roles <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}

export function CareersFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <div className="inline-flex items-center gap-3 text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-lg font-black">
              R
            </span>
            <span className="text-xl font-black tracking-tight">ROVE</span>
          </div>
          <p className="mt-5 max-w-md text-sm leading-6 text-slate-400">
            We build thoughtful technology with ambitious people. Come shape
            what is next with us.
          </p>
        </div>
        <div className="flex gap-3">
          <a
            href="mailto:careers@rove.com"
            aria-label="Email ROVE careers"
            className="rounded-xl border border-slate-700 p-3 transition hover:border-blue-500 hover:text-white"
          >
            <Mail className="h-5 w-5" />
          </a>
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noreferrer"
            aria-label="ROVE on LinkedIn"
            className="rounded-xl border border-slate-700 p-3 transition hover:border-blue-500 hover:text-white"
          >
            <LinkIcon className="h-5 w-5" />
          </a>
        </div>
      </div>
      <div className="border-t border-slate-800 px-5 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} ROVE. Built for people who care deeply.
      </div>
    </footer>
  );
}

export default function CareersShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <CareersHeader />
      <main>{children}</main>
      <CareersFooter />
    </div>
  );
}
