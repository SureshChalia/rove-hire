import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { RoveLogo, CareersFooter } from "@/components/careers/CareersShell";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <RoveLogo href="/" />
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <a href="#about" className="transition hover:text-blue-600">
            About
          </a>
          <a href="#features" className="transition hover:text-blue-600">
            Platform
          </a>
          <Link href="/careers" className="transition hover:text-blue-600">
            Careers
          </Link>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="hidden rounded-xl sm:inline-flex"
          >
            <Link href="/careers">Browse Jobs</Link>
          </Button>
          <Button asChild size="sm" className="rounded-xl bg-blue-600 hover:bg-blue-700">
            <Link href="/auth/login">HR Login</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

export default function LandingShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <LandingHeader />
      <main>{children}</main>
      <CareersFooter />
    </div>
  );
}
