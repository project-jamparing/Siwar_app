import Link from "next/link";
import {
  Bell,
  Home,
  Megaphone,
  Users,
  History,
  Crown,
  Lock,
  Users2,
} from "lucide-react";
import LogoutButton from "@/components/Buttons/LogoutButton";
import { cookies } from "next/headers";
import Image from "next/image";

const menuItemsByRole: Record<
  string,
  { label: string; href: string; icon: JSX.Element }[]
> = {
  "1": [
    { label: "Dashboard", href: "/dashboard/admin", icon: <Home className="w-5 h-5" /> },
    { label: "Data RW/RT", href: "/dashboard/admin/Data", icon: <Users className="w-5 h-5" /> },
    { label: "Data Warga", href: "/dashboard/admin/warga", icon: <Users2 className="w-5 h-5" /> },
    { label: "Data KK", href: "/dashboard/admin/kepala-keluarga", icon: <Crown className="w-5 h-5" /> },
  ],
  "2": [
    { label: "Dashboard", href: "/dashboard/rw", icon: <Home className="w-5 h-5" /> },
    { label: "Data Warga", href: "/dashboard/rw/warga", icon: <Users className="w-5 h-5" /> },
    { label: "Data KK", href: "/dashboard/rw/kepala-keluarga", icon: <Crown className="w-5 h-5" /> },
    { label: "Pengumuman", href: "/dashboard/rw/pengumuman", icon: <Megaphone className="w-5 h-5" /> },
    { label: "Data Iuran", href: "/dashboard/rw/iuran", icon: <Bell className="w-5 h-5" /> },
    { label: "Data Riwayat Iuran", href: "/dashboard/rw/databayar", icon: <Bell className="w-5 h-5" /> },
  ],
  "3": [
    { label: "Dashboard", href: "/dashboard/rt", icon: <Home className="w-5 h-5" /> },
    { label: "Data Warga", href: "/dashboard/rt/warga", icon: <Users className="w-5 h-5" /> },
    { label: "Data KK", href: "/dashboard/rt/kepala-keluarga", icon: <Crown className="w-5 h-5" /> },
    { label: "Data Iuran RT", href: "/dashboard/rt/iuran", icon: <Bell className="w-5 h-5" /> },
    { label: "Riwayat Iuran", href: "/dashboard/rt/riwayat", icon: <History className="w-5 h-5" /> },
    { label: "Pengumuman", href: "/dashboard/rt/pengumuman", icon: <Megaphone className="w-5 h-5" /> },
  ],
  "4": [
    { label: "Dashboard", href: "/dashboard/warga", icon: <Home className="w-5 h-5" /> },
    { label: "Data Keluarga", href: "/dashboard/warga/keluarga", icon: <Users className="w-5 h-5" /> },
    { label: "Iuran Saya", href: "/dashboard/warga/iuran", icon: <Bell className="w-5 h-5" /> },
    { label: "Pengumuman", href: "/dashboard/warga/pengumuman", icon: <Megaphone className="w-5 h-5" /> },
    { label: "Ganti Password", href: "/dashboard/warga/ganti-password", icon: <Lock className="w-5 h-5" /> },
  ],
};

export default async function SideBar() {
  const cookieStore = await cookies();
  const role_id = cookieStore.get("role_id")?.value ?? "4";
  const menuItems = menuItemsByRole[role_id] || [];

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col justify-between shadow-sm hidden md:flex">
      <div>
      <div className="p-6 border-b border-gray-200 pb-4">
          <Image
            src="/images/logo/logo.png"
            alt="SIWAR APP"
            width={160}
            height={50}
            className="mx-auto"
          />
        </div>
        <nav className="px-4 pt-6 space-y-3">
          {menuItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-blue-100 hover:text-blue-600 text-gray-800 font-medium"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-200">
        <LogoutButton />
      </div>
    </aside>
  );
}