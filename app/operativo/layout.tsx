"use client";

import React from "react";
import { Topbar } from "@/components/layout/topbar";
import { SidebarOperativo } from "@/components/layout/sidebar-operativo";

export default function OperativoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans">
      <Topbar />
      <div className="flex flex-1">
        <SidebarOperativo />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
