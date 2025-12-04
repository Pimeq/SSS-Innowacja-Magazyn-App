"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="w-full max-w-2xl mx-auto px-4 py-12 text-center">
        <h1 className="text-5xl font-bold text-white mb-4">
          Welcome to Magazyn App
        </h1>
        <p className="text-xl text-slate-300 mb-8">
          A modern inventory management application built with Next.js and Neon
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition duration-200"
          >
            Register
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Secure Auth",
              description: "NextAuth.js with Neon PostgreSQL",
            },
            {
              title: "Session Management",
              description: "7-day persistent sessions",
            },
            {
              title: "Admin Dashboard",
              description: "Full-featured admin panel",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-slate-800 p-6 rounded-lg border border-slate-700"
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
