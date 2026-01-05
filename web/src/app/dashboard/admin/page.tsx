"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Navbar */}
      <nav className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-white text-2xl font-bold">Admin Panel</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-slate-300">{session.user?.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Welcome, {session.user?.name || session.user?.email}!
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            You are successfully logged in. Your session will remain active for 7 days.
          </p>

          {/* Session Info Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 dark:bg-slate-700 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Session Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Email
                  </p>
                  <p className="text-slate-900 dark:text-white font-medium">
                    {session.user?.email}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Name
                  </p>
                  <p className="text-slate-900 dark:text-white font-medium">
                    {session.user?.name || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    User ID
                  </p>
                  <p className="text-slate-900 dark:text-white font-medium">
                    {session.user?.id}
                  </p>
                </div>
              </div>
            </div>

            {/* Features Card */}
            <div className="bg-slate-50 dark:bg-slate-700 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Session Details
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Status
                  </p>
                  <p className="text-slate-900 dark:text-white font-medium">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Active
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Session Duration
                  </p>
                  <p className="text-slate-900 dark:text-white font-medium">
                    7 days
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Auth Provider
                  </p>
                  <p className="text-slate-900 dark:text-white font-medium">
                    Credentials (Neon DB)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Sections */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Dashboard Content
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Analytics",
                  description: "View your analytics and statistics",
                  icon: "📊",
                },
                {
                  title: "Settings",
                  description: "Manage your account settings",
                  icon: "⚙️",
                },
                {
                  title: "Reports",
                  description: "Generate and view reports",
                  icon: "📄",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-slate-50 dark:bg-slate-700 p-6 rounded-lg hover:shadow-lg transition duration-200"
                >
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {item.title}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
