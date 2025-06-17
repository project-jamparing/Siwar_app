import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Megaphone, CheckCircle, AlertCircle, Layers3 } from 'lucide-react';

export default async function WargaPage() {
  const cookie = await cookies();
  const nik = cookie.get('nik')?.value;

  if (!nik) {
    redirect('/login');
  }

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

  if (!user || user.role_id !== 4) {
    redirect('/login');
  }

  const userName = user.warga?.nama || user.nik;

  const kategoriId = user.warga?.kk?.kategori_id;
  let kategori = null;

  if (kategoriId) {
    kategori = await prisma.kategori.findUnique({
      where: { id: kategoriId },
    });
  }

  // Dummy status iuran & pengumuman
  const statusIuran = 'Lunas'; // contoh: Lunas / Belum Lunas
  const pengumumanAktif = 3;

  return (
    <main className="flex-1 p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          Selamat Datang, <span className="text-blue-800">{userName}</span>
        </h2>
        <p className="text-sm text-gray-500">Semoga harimu menyenangkan! 🌞</p>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200 flex items-center gap-4 hover:shadow-lg transition">
          <Layers3 className="w-10 h-10 text-indigo-500" />
          <div>
            <h3 className="text-sm text-gray-500 mb-1">Kategori</h3>
            <p className="text-lg font-semibold text-gray-700">{kategori?.nama || 'Belum Ditentukan'}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200 flex items-center gap-4 hover:shadow-lg transition">
          {statusIuran === 'Lunas' ? (
            <CheckCircle className="w-10 h-10 text-green-500" />
          ) : (
            <AlertCircle className="w-10 h-10 text-red-500" />
          )}
          <div>
            <h3 className="text-sm text-gray-500 mb-1">Status Iuran</h3>
            <p className="text-lg font-semibold text-gray-700">{statusIuran}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200 flex items-center gap-4 hover:shadow-lg transition">
          <Megaphone className="w-10 h-10 text-yellow-500" />
          <div>
            <h3 className="text-sm text-gray-500 mb-1">Pengumuman Aktif</h3>
            <p className="text-lg font-semibold text-gray-700">{pengumumanAktif}</p>
          </div>
        </div>
      </div>

      {/* Pengumuman */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Pengumuman Terbaru</h2>
        <div className="space-y-3">
          <div className="p-4 bg-indigo-50 rounded-lg">
            <h3 className="font-semibold text-indigo-700">Pemberitahuan Iuran Bulan Ini</h3>
            <p className="text-gray-600 text-sm">Batas pembayaran tanggal 25 setiap bulan.</p>
          </div>
          <div className="p-4 bg-indigo-50 rounded-lg">
            <h3 className="font-semibold text-indigo-700">Jadwal Kerja Bakti</h3>
            <p className="text-gray-600 text-sm">Minggu depan, jam 07.00 pagi di lingkungan RT masing-masing.</p>
          </div>
        </div>
      </div>
    </main>
  );
}