import Link from "next/link";
import { Bell, Home, Megaphone, Users, History, Crown } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import { cookies } from "next/headers";

const menuItemsByRole: Record<
  string,
  { label: string; href: string; icon: JSX.Element }[]
> = {
  "1": [
    { label: "Dashboard", href: "/dashboard/admin", icon: <Home className="w-5 h-5" /> },
    { label: "Data RW/RT", href: "/dashboard/admin/data", icon: <Users className="w-5 h-5" /> },
  ],
  "2": [
    { label: "Dashboard", href: "/dashboard/rw", icon: <Home className="w-5 h-5" /> },
    { label: "Data Warga", href: "/dashboard/rw/warga", icon: <Users className="w-5 h-5" /> },
    { label: "Data Kepala Keluarga", href: "/dashboard/rw/kepala-keluarga", icon: <Crown className="w-5 h-5" /> },
    { label: "Data Iuran", href: "/dashboard/rw/iuaran", icon: <Bell className="w-5 h-5" /> },
    { label: "Pengumuman", href: "/dashboard/rw/pengumuman", icon: <Megaphone className="w-5 h-5" /> },
  ],
  "3": [
    { label: "Dashboard", href: "/dashboard/rt", icon: <Home className="w-5 h-5" /> },
    { label: "Data Warga", href: "/dashboard/rt/warga", icon: <Users className="w-5 h-5" /> },
    { label: "Data Iuran RT", href: "/dashboard/rt/iuran", icon: <Bell className="w-5 h-5" /> },
    { label: "Riwayat Iuran", href: "/dashboard/rt/riwayat", icon: <History className="w-5 h-5" /> },
    { label: "Pengumuman", href: "/dashboard/rt/pengumuman", icon: <Megaphone className="w-5 h-5" /> },
  ],
  "4": [
    { label: "Dashboard", href: "/dashboard/warga", icon: <Home className="w-5 h-5" /> },
    { label: "Data Keluarga", href: "/dashboard/warga/keluarga", icon: <Users className="w-5 h-5" /> },
    { label: "Iuran Saya", href: "/dashboard/warga/iuran", icon: <Bell className="w-5 h-5" /> },
    { label: "Pengumuman", href: "/dashboard/warga/pengumuman", icon: <Megaphone className="w-5 h-5" /> },
  ],
};

export default async function SideBar() {
  const cookieStore = await cookies();
  const role_id = cookieStore.get("role_id")?.value ?? "4"; 

  const menuItems = menuItemsByRole[role_id] || [];

  return (
    <aside className="w-64 bg-white border-r shadow-lg hidden md:flex flex-col justify-between">
      <div>
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-blue-600">SIWAR APP</h2>
        </div>
        <nav className="p-4 space-y-4">
          {menuItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
          <LogoutButton />
        </nav>
      </div>
    </aside>
  );
}