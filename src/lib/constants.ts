import { createElement } from "react";

type SidebarIconProps = {
  size?: number;
  className?: string;
};

function createIcon(children: Array<ReturnType<typeof createElement>>) {
  function SidebarIcon({ size = 20, className = "" }: SidebarIconProps) {
    return createElement(
      "svg",
      {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className,
      },
      ...children
    );
  }

  SidebarIcon.displayName = "SidebarIcon";
  return SidebarIcon;
}

const DashboardIcon = createIcon([
  createElement("rect", { key: "a", x: 3, y: 3, width: 7, height: 7 }),
  createElement("rect", { key: "b", x: 14, y: 3, width: 7, height: 7 }),
  createElement("rect", { key: "c", x: 14, y: 14, width: 7, height: 7 }),
  createElement("rect", { key: "d", x: 3, y: 14, width: 7, height: 7 }),
]);

const JobsIcon = createIcon([
  createElement("path", { key: "a", d: "M3 7h18" }),
  createElement("rect", { key: "b", x: 4, y: 4, width: 16, height: 16, rx: 2 }),
  createElement("path", { key: "c", d: "M9 7V3" }),
  createElement("path", { key: "d", d: "M15 7V3" }),
]);

const CandidatesIcon = createIcon([
  createElement("path", { key: "a", d: "M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" }),
  createElement("circle", { key: "b", cx: 9.5, cy: 7, r: 3 }),
  createElement("path", { key: "c", d: "M18 8a3 3 0 1 1 0 6" }),
]);

const InterviewsIcon = createIcon([
  createElement("rect", { key: "a", x: 3, y: 4, width: 18, height: 18, rx: 2 }),
  createElement("path", { key: "b", d: "M16 2v4" }),
  createElement("path", { key: "c", d: "M8 2v4" }),
  createElement("path", { key: "d", d: "M3 10h18" }),
]);

const OffersIcon = createIcon([
  createElement("path", { key: "a", d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
  createElement("path", { key: "b", d: "M14 2v6h6" }),
  createElement("path", { key: "c", d: "M8 13h8" }),
  createElement("path", { key: "d", d: "M8 17h5" }),
]);

export const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: DashboardIcon,
  },
  {
    title: "Jobs",
    href: "/dashboard/jobs",
    icon: JobsIcon,
  },
  {
    title: "Candidates",
    href: "/dashboard/candidates",
    icon: CandidatesIcon,
  },
  {
    title: "Interviews",
    href: "/dashboard/interviews",
    icon: InterviewsIcon,
  },
  {
    title: "Offers",
    href: "/dashboard/offers",
    icon: OffersIcon,
  },
];
