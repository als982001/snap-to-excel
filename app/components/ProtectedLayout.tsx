import { NavLink, Navigate, Outlet } from "react-router";

import { LogOut } from "lucide-react";
import { useAuth } from "~/contexts/AuthContext";

export default function ProtectedLayout() {
  const { context } = useAuth();
  const { user, isLoading, signOut } = context;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-secondary">로딩 중...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background-light">
      <nav className="bg-white border-b border-border-color px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="text-lg font-bold text-text-primary">
            Snap to Excel
          </span>

          <div className="flex gap-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive
                    ? "text-text-primary"
                    : "text-text-secondary hover:text-text-primary"
                }`
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/history"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive
                    ? "text-text-primary"
                    : "text-text-secondary hover:text-text-primary"
                }`
              }
            >
              History
            </NavLink>
          </div>
        </div>

        <button
          type="button"
          onClick={signOut}
          className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          <LogOut size={16} />
          로그아웃
        </button>
      </nav>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
