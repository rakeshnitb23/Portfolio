export interface NavLink {
  name: string;
  href: string;
}

// Full navigation order, as shown in the sidebar (Home's sub-pages) and used
// for footer "Next" pagination.
export const NAV_LINKS: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "/side-projects" },
  { name: "Blogs", href: "/blogs" },
  { name: "User Manual", href: "/user-manual" },
  { name: "Books", href: "/books" },
  { name: "Resume", href: "/resume" },
  { name: "Writing", href: "/writing" },
];

// Top-level tabs shown in the header bar.
export const TOP_NAV_LINKS: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "Writing", href: "/writing" },
];

// Home section's sub-pages, shown in the left sidebar.
export const SIDEBAR_LINKS: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "/side-projects" },
  { name: "Blogs", href: "/blogs" },
  { name: "User Manual", href: "/user-manual" },
  { name: "Books", href: "/books" },
  { name: "Resume", href: "/resume" },
];

export function isNavLinkActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
