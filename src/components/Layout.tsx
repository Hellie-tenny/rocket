import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition-colors ${
    isActive ? "text-orange-500" : "text-ink-700 hover:text-ink-950"
  }`;

const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-lg px-3 py-2 text-base font-medium transition-colors ${
    isActive ? "bg-orange-100 text-orange-600" : "text-ink-700 hover:bg-paper-dim"
  }`;

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink-950">
      <header className="border-b border-line">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <NavLink to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2">
            <img src="/rocket-logo.png" alt="Rocket" className="h-7 w-auto" />
          </NavLink>

          {/* Desktop nav */}
          <div className="hidden items-center gap-8 sm:flex">
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

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-950 sm:hidden"
          >
            {menuOpen ? (
              <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                <path
                  d="M6 6l12 12M6 18L18 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </nav>

        {/* Mobile nav panel */}
        {menuOpen && (
          <div className="border-t border-line px-4 py-3 sm:hidden">
            <NavLink to="/" end onClick={() => setMenuOpen(false)} className={mobileNavLinkClass}>
              Home
            </NavLink>
            <NavLink to="/projects" onClick={() => setMenuOpen(false)} className={mobileNavLinkClass}>
              Work
            </NavLink>
            <NavLink to="/blog" onClick={() => setMenuOpen(false)} className={mobileNavLinkClass}>
              Blog
            </NavLink>
            <NavLink to="/about" onClick={() => setMenuOpen(false)} className={mobileNavLinkClass}>
              About
            </NavLink>
            <NavLink to="/contact" onClick={() => setMenuOpen(false)} className={mobileNavLinkClass}>
              Contact
            </NavLink>
          </div>
        )}
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
