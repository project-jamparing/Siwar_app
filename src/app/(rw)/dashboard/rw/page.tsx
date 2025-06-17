import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import {
  Users,
  FileCheck2,
  Megaphone,
} from 'lucide-react';

export default async function RWPage() {
  const cookie = await cookies();
  const nik = cookie.get('nik')?.value;

  if (!nik) {
    redirect('/login');
  }

  const user = await prisma.user.findFirst({
    where: { nik },
    include: { warga: true },
  });

  if (!user || user.role_id !== 2) {
    redirect('/login');
  }

  const userName = user.warga?.nama || user.nik;

  const warga = await prisma.warga.findMany();

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
            <h3 className="text-lg font-semibold text-gray-700">Total Iuran RW</h3>
            <FileCheck2 className="text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800">Rp 6.500.000</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-700">Pengumuman RW</h3>
            <Megaphone className="text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800">4</p>
        </div>
      </div>

      {/* Pengumuman */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Pengumuman RW Terbaru</h2>
        <div className="space-y-3">
          <div className="p-4 bg-indigo-50 rounded-lg">
            <h3 className="font-semibold text-indigo-700">Musyawarah Warga RW</h3>
            <p className="text-gray-600 text-sm">Sabtu, 20.00 WIB di Aula RW</p>
          </div>
          <div className="p-4 bg-indigo-50 rounded-lg">
            <h3 className="font-semibold text-indigo-700">Gotong Royong Mingguan</h3>
            <p className="text-gray-600 text-sm">Minggu, 06.00 pagi – lingkungan RW</p>
          </div>
        </div>
      </div>
    </main>
  );
}