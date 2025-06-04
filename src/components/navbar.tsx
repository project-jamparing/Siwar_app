import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Navbar() {
  const cookie = await cookies();
  const nik = cookie.get("nik")?.value;

  if (!nik) {
    redirect("/login");
  }

  const user = await prisma.user.findFirst({
    where: { nik },
    include: { warga: true },
  });

  if (!user || !user.role_id || ![1, 2, 3, 4].includes(user.role_id)) {
    redirect("/login");
  }

  const userName = user.warga?.nama || user.nik;
  const roleName: Record<number, string> = {
    1: "Admin",
    2: "RW",
    3: "RT",
    4: "Warga",
  };
  const roleLabel = roleName[user.role_id] || "Tidak Diketahui";

  return (
    <header className="w-full bg-gray-50 border-b px-6 py-4 flex justify-between items-center shadow-sm">
      <div>
        <h1 className="text-lg md:text-xl font-semibold text-gray-800">
          Dashboard <span className="text-blue-600">{roleLabel}</span>
        </h1>
      </div>
      <div className="text-sm text-gray-600">
        Selamat Datang,{" "}
        <span className="font-medium text-blue-600">{userName}</span>
      </div>
    </header>
  );
}