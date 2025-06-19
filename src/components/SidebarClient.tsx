'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import LogoutButton from "@/components/Buttons/LogoutButton";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

interface SidebarClientProps {
  menuItems: { label: string; href: string; icon: JSX.Element }[];
}

export default function SidebarClient({ menuItems }: SidebarClientProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Reset drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close with ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  // Lock scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  return (
    <>
      {/* Mobile Header */}
      <div className={`md:hidden flex items-center justify-between px-4 py-3 border-b bg-white/80 backdrop-blur-md transition-opacity duration-300 sticky top-0 z-20 ${open ? 'opacity-0' : 'opacity-100'}`}>
        <Image
          src="/images/logo/logo.png"
          alt="SIWAR APP"
          width={120}
          height={40}
          className={`${open ? 'hidden' : 'block'}`}
        />
        <button onClick={() => setOpen(true)}>
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Mobile Drawer */}
      <div className={`fixed top-0 left-0 z-40 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "-translate-x-full"} md:hidden flex flex-col`}>
        <div className="flex items-center justify-between p-4 border-b shadow-sm">
          <Image src="/images/logo/logo.png" alt="SIWAR APP" width={140} height={40} />
          <button onClick={() => setOpen(false)}>
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 pt-4 space-y-2">
          {menuItems.map((item, idx) => {
            const isActive = pathname === item.href;
            return (
              <Link key={idx} href={item.href} className="relative block group">
                {isActive && (
                  <span className="absolute left-0 top-0 h-full w-1 rounded-r-full bg-blue-500" />
                )}
                <div className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all group-hover:translate-x-[2px] duration-200 hover:bg-blue-100 text-gray-700 hover:text-blue-600 ${isActive ? 'bg-blue-100 text-blue-600 font-semibold shadow-inner' : ''}`}>
                  <div className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'} group-hover:bg-blue-600 group-hover:text-white`}>
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t mt-auto">
          <LogoutButton />
        </div>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 backdrop-blur-sm bg-black/30 transition-opacity duration-300 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 h-screen bg-white border-r border-gray-200 flex-col justify-between shadow-md sticky top-0">
        <div className="flex flex-col flex-1 overflow-y-auto">
          <div className="p-6 border-b border-gray-200 pb-4">
            <Image src="/images/logo/logo.png" alt="SIWAR APP" width={160} height={50} className="mx-auto" />
          </div>
          <nav className="flex-1 px-4 pt-6 space-y-2">
            {menuItems.map((item, idx) => {
              const isActive = pathname === item.href;
              return (
                <Link key={idx} href={item.href} className="relative block group">
                  {isActive && (
                    <span className="absolute left-0 top-0 h-full w-1 rounded-r-full bg-blue-500" />
                  )}
                  <div className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all group-hover:translate-x-[2px] duration-200 hover:bg-blue-100 text-gray-700 hover:text-blue-600 ${isActive ? 'bg-blue-100 text-blue-600 font-semibold shadow-inner' : ''}`}>
                    <div className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'} group-hover:bg-blue-600 group-hover:text-white`}>
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-100">
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
