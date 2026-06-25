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

export default function Header() {
  return (
    <header className="border-b bg-white px-4 py-3 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          placeholder="Search..."
          className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none sm:max-w-xs"
        />

        <div className="flex items-center justify-end gap-4">
          <BellIcon size={22} />

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
            HR
          </div>
        </div>
      </div>
    </header>
  );
}