import { Menu } from "lucide-react";

function BellIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10.268 3.354a2 2 0 0 1 3.464 0A7.002 7.002 0 0 0 18 10v3.586c0 .5.152.99.434 1.414L19 17H5l.566-2c.282-.424.434-.914.434-1.414V10a7.002 7.002 0 0 0 4.732-6.646Z" />
      <path d="M9 17a3 3 0 0 0 6 0" />
    </svg>
  );
}

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="border-b bg-white px-4 py-3 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        {/* Left Section */}
        <div className="flex flex-1 items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="rounded-lg p-2 transition hover:bg-slate-100 lg:hidden"
          >
            <Menu size={24} />
          </button>

          {/* Search */}
          <input
            placeholder="Search..."
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none focus:border-blue-500 sm:max-w-xs"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <button className="rounded-lg p-2 transition hover:bg-slate-100">
            <BellIcon size={22} />
          </button>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
            HR
          </div>
        </div>
      </div>
    </header>
  );
}