import { NavLink, Outlet } from "react-router-dom";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition-colors ${
    isActive ? "text-orange-500" : "text-ink-700 hover:text-ink-950"
  }`;

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink-950">
      <header className="border-b border-line">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <NavLink to="/" className="flex items-center gap-2">
            <img src="/rocket-logo.png" alt="Rocket" className="h-7 w-auto" />
          </NavLink>
          <div className="flex items-center gap-8">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/projects" className={navLinkClass}>
              Work
            </NavLink>
            <NavLink to="/blog" className={navLinkClass}>
              Blog
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>
            <NavLink
              to="/contact"
              className="rounded-full bg-ink-950 px-5 py-2 text-sm font-semibold text-paper transition-colors hover:bg-orange-500"
            >
              Contact
            </NavLink>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-line bg-paper-dim">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row">
          <img src="/rocket-logo.png" alt="Rocket" className="h-6 w-auto opacity-80" />
          <p className="text-sm text-ink-500">
            &copy; {new Date().getFullYear()} Rocket. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
