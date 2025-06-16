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

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b transition-opacity duration-300 ${open ? 'opacity-0' : 'opacity-100">
        <Image
          src="/images/logo/logo.png"
          alt="SIWAR APP"
          width={120}
          height={40}
          className={`${open ? 'hidden' : 'block'}`}
        />
        <button onClick={() => setOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Drawer */}
      <div className={`fixed top-0 left-0 z-40 h-full w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "-translate-x-full"} md:hidden`}>
        <div className="flex items-center justify-between p-4 border-b">
          <Image src="/images/logo/logo.png" alt="SIWAR APP" width={140} height={40} />
          <button onClick={() => setOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="px-4 pt-4 space-y-2">
          {menuItems.map((item, idx) => (
            <Link key={idx} href={item.href} className={`flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-100 text-gray-700 hover:text-blue-600 transition group ${pathname === item.href ? 'bg-blue-100 text-blue-600' : ''}`}>
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition">
                {item.icon}
              </div>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t mt-auto">
          <LogoutButton />
        </div>
      </div>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-30 bg-black bg-opacity-30 md:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 h-screen bg-white border-r border-gray-200 flex-col justify-between shadow-sm">
        <div>
          <div className="p-6 border-b border-gray-200 pb-4">
            <Image src="/images/logo/logo.png" alt="SIWAR APP" width={160} height={50} className="mx-auto" />
          </div>
          <nav className="px-4 pt-6 space-y-2">
            {menuItems.map((item, idx) => (
              <Link key={idx} href={item.href} className={`flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-100 text-gray-700 hover:text-blue-600 transition group ${pathname === item.href ? 'bg-blue-100 text-blue-600' : ''}`}>
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition">
                  {item.icon}
                </div>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200">
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}