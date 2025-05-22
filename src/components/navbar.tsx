import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Navbar() {
  const cookie = await cookies();
  const nik = cookie.get('nik')?.value;

  if (!nik) {
    redirect('/login');
  }

  const user = await prisma.user.findFirst({
    where: { nik },
    include: { warga: true },
  });

  if (!user || !user.role_id || ![1, 2, 3, 4].includes(user.role_id)) {
    redirect('/login');
  }  

  const userName = user.warga?.nama || user.nik || user.role_id;

  const roleName: Record<number, string> = {
    1: "Admin",
    2: "RW",
    3: "RT",
    4: "Warga",
  };

  const roleLabel = roleName[user.role_id] || "Tidak Diketahui";

  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-800">Dashboard {roleLabel}</h1>
      <p className="text-sm text-gray-600">
        Halo, Selamat Datang <span className="font-medium text-blue-600">{userName}</span>
      </p>
    </header>
  );
}