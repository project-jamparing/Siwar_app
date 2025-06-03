'use client'
import type { Metadata } from "next";
import "../globals.css";
import SideBar from "@/components/sidebar";
import Navbar from "@/components/navbar";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import AppHeader from "@/layout/AppHeader";
import { useSidebar } from "@/context/SidebarContext";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  

  return (
    
  //   <div className="flex h-screen bg-gray-50">
  //   <SideBar />
  
  //   <div className="flex-1 flex flex-col">
  //     <Navbar />
  
  //     <main className="flex-1 p-6 overflow-auto">
  //       {children}
  //     </main>
  //   </div>
  // </div>
  <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      {/* <AppSidebar /> */}
      {/* <Backdrop /> */}
      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all  duration-300 ease-in-out `}
      >
        {/* Header */}
        {/* <AppHeader /> */}
        {/* Page Content */}
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
      </div>
    </div>
  );
}