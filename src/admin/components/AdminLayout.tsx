import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? "bg-orange-100 text-orange-600" : "text-ink-700 hover:bg-paper-dim"
  }`;

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-paper text-ink-950">
      <aside className="flex w-60 shrink-0 flex-col border-r border-line px-4 py-6">
        <img src="/rocket-logo.png" alt="Rocket" className="mb-8 h-6 w-auto" />

        <nav className="flex-1 space-y-1">
          <NavLink to="/admin" end className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/posts" className={linkClass}>
            Posts
          </NavLink>
          <NavLink to="/admin/posts/new" className={linkClass}>
            New Post
          </NavLink>
          <NavLink to="/admin/analytics" className={linkClass}>
            Analytics
          </NavLink>
        </nav>

        <div className="border-t border-line pt-4">
          <p className="truncate text-xs text-ink-500">{user?.email}</p>
          <button
            onClick={handleLogout}
            className="mt-2 text-sm font-medium text-ink-700 hover:text-orange-600"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
