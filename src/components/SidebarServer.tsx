// app/components/SidebarServer.tsx
import { cookies } from "next/headers";
import SidebarClient from "./SidebarClient";
import { Crown, Home, Users, Users2, Megaphone, Bell, History, Lock } from "lucide-react";

const menuItemsByRole: Record<
  string,
  { label: string; href: string; icon: JSX.Element }[]
> = {
  "1": [
    { label: "Dashboard", href: "/dashboard/admin", icon: <Home className="w-5 h-5" /> },
    { label: "Data RW/RT", href: "/dashboard/admin/DataRW/RT", icon: <Users className="w-5 h-5" /> },
    { label: "Data Warga", href: "/dashboard/admin/warga", icon: <Users2 className="w-5 h-5" /> },
    { label: "Data KK", href: "/dashboard/admin/kepala-keluarga", icon: <Crown className="w-5 h-5" /> },
    { label: "Pengumuman", href: "/dashboard/admin/pengumuman", icon: <Megaphone className="w-5 h-5" /> },
  ],
  "2": [
    { label: "Dashboard", href: "/dashboard/rw", icon: <Home className="w-5 h-5" /> },
    { label: "Data Warga", href: "/dashboard/rw/warga", icon: <Users className="w-5 h-5" /> },
    { label: "Data KK", href: "/dashboard/rw/kepala-keluarga", icon: <Crown className="w-5 h-5" /> },
    { label: "Data Iuran", href: "/dashboard/rw/iuaran", icon: <Bell className="w-5 h-5" /> },
    { label: "Pengumuman", href: "/dashboard/rw/pengumuman", icon: <Megaphone className="w-5 h-5" /> },
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

export default async function SidebarServer() {
  const cookieStore = await cookies();
  const role_id = cookieStore.get("role_id")?.value ?? "4";
  const menuItems = menuItemsByRole[role_id] || [];

  return <SidebarClient menuItems={menuItems} />;
}

