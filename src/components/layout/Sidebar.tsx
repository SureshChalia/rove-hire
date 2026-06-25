"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarItems } from "../../lib/constants";
import { cn } from "../../lib/utils";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 z-30 h-screen w-64 border-r bg-white transition-all duration-300 lg:block hidden">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-2xl font-bold text-blue-600">ROVE Hire</h1>
      </div>

      <nav className="space-y-2 p-4">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 transition-all hover:bg-slate-100",
                isActive && "bg-blue-600 text-white hover:bg-blue-600"
              )}
            >
              <Icon size={20} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}