"use client";

import { signOut } from "next-auth/react";

export default function WorkerPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h1 className="text-4xl font-bold text-green-600">Works!</h1>
      <p className="text-xl">I am a worker.</p>
      
      <button 
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        Wyloguj się
      </button>
    </div>
  );
}