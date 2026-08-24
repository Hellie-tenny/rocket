import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? "bg-orange-100 text-orange-600" : "text-ink-700 hover:bg-paper-dim"
  }`;

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  const closeSidebar = () => setSidebarOpen(false);

  const navLinks = (
    <nav className="flex-1 space-y-1">
      <NavLink to="/admin" end className={linkClass} onClick={closeSidebar}>
        Dashboard
      </NavLink>
      <NavLink to="/admin/posts" end className={linkClass} onClick={closeSidebar}>
        Posts
      </NavLink>
      <NavLink to="/admin/posts/new" className={linkClass} onClick={closeSidebar}>
        New Post
      </NavLink>
      <NavLink to="/admin/analytics" className={linkClass} onClick={closeSidebar}>
        Analytics
      </NavLink>
    </nav>
  );

  const accountFooter = (
    <div className="border-t border-line pt-4">
      <p className="truncate text-xs text-ink-500">{user?.email}</p>
      <button
        onClick={handleLogout}
        className="mt-2 text-sm font-medium text-ink-700 hover:text-orange-600"
      >
        Sign out
      </button>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink-950 lg:flex-row">
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-line px-4 py-3 lg:hidden">
        <img src="/rocket-logo.png" alt="Rocket" className="h-6 w-auto shrink-0 object-contain" />
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-950"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink-950/40" onClick={closeSidebar} />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-paper px-4 py-6">
            <div className="mb-8 flex items-center justify-between">
              <img
                src="/rocket-logo.png"
                alt="Rocket"
                className="h-6 w-auto shrink-0 object-contain"
              />
              <button
                type="button"
                onClick={closeSidebar}
                aria-label="Close menu"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-950"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                  <path
                    d="M6 6l12 12M6 18L18 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            {navLinks}
            {accountFooter}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-line px-4 py-6 lg:flex">
        <img
          src="/rocket-logo.png"
          alt="Rocket"
          className="mb-8 h-6 w-auto shrink-0 self-start object-contain"
        />
        {navLinks}
        {accountFooter}
      </aside>

      <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
}
