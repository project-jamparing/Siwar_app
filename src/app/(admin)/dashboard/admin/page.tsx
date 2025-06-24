import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Users, Megaphone } from 'lucide-react';


export default async function AdminPage() {
  const cookie = await cookies();
  const nik = cookie.get('nik')?.value;

  if (!nik) {
    redirect('/login');
  }

  const warga = await prisma.warga.findMany();
  const userCount = await prisma.user.count();

  const user = await prisma.user.findFirst({
    where: { nik },
    include: {
      warga: {
        include: {
          kk: true,
        },
      },
    },
  });

  if (!user || user.role_id !== 1) {
    redirect('/login');
  }

  const userName = user.warga?.nama || user.nik;
  const kategoriId = user.warga?.kk?.kategori_id;

  let kategori = null;
  if (kategoriId) {
    kategori = await prisma.kategori.findUnique({ where: { id: kategoriId } });
  }

  // Ambil pengumuman terbaru
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/pengumuman?terbaru=true&role=warga&nik=${nik}`,
    { cache: 'no-store' }
  );

  const json = await res.json();
  const pengumuman = json.data || [];

  return (
    <main className="flex-1 p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          Selamat Datang, <span className="text-blue-800">{userName}</span>
        </h2>
        <p className="text-sm text-gray-500">Semoga harimu menyenangkan! 🌞</p>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-700">Jumlah Warga</h3>
            <Users className="text-indigo-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800">{warga.length}</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-700">Jumlah Akun Pengguna</h3>
            <Users className="text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800">{userCount}</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-700">Pengumuman Aktif</h3>
            <Megaphone className="text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800">{pengumuman.length}</p>
        </div>
      </div>
    </main>
  );
}
