'use client';

import { AdminSidebar } from "./Sidebar";
import { AdminHeader } from "./Header";
import { ReactNode } from "react";

interface AdminLayoutProps {
  title: string;
  children: ReactNode;
}

export function AdminLayout({ title, children }: AdminLayoutProps) {
  return (
    <div className="flex h-screen bg-slate-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader title={title} />

        <main className="flex-1 overflow-auto ml-64">
          <div className="p-8 text-slate-800 leading-relaxed md:text-[15px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
