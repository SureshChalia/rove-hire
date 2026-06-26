"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";

import { sidebarItems } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

function SidebarContent({
  close,
}: {
  close?: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-2xl font-bold text-blue-600">
          ROVE Hire
        </h1>
      </div>

      <nav className="space-y-2 p-4">
        {sidebarItems.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 transition hover:bg-slate-100",
                active &&
                  "bg-blue-600 text-white hover:bg-blue-600"
              )}
            >
              <Icon size={20} />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export default function Sidebar({
  open,
  setOpen,
}: Props) {
  return (
    <>
      {/* Desktop */}

      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r bg-white lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile */}

      <Sheet
        open={open}
        onOpenChange={setOpen}
      >
        <SheetContent
          side="left"
          className="w-64 p-0"
        >
          <SidebarContent
            close={() => setOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}