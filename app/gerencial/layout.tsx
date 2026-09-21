"use client";

import React from "react";
import { Topbar } from "@/components/layout/topbar";
import { SidebarGerencial } from "@/components/layout/sidebar-gerencial";

export default function GerencialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans">
      <Topbar />
      <div className="flex flex-1">
        <SidebarGerencial />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
