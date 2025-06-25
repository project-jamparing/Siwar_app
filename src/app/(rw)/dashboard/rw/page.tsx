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

  // Ambil semua warga (global)
  const warga = await prisma.warga.findMany();
  const jumlahWarga = warga.length;

  // --- Hitung Total Iuran RW dari semua RT ---
  // 1. Ambil semua RT
  const rtList = await prisma.rukun_tetangga.findMany({
    select: { id: true },
  });
  const rtIds = rtList.map(rt => rt.id);

  // 2. Ambil semua tagihan yang sudah lunas dari RT yang ditemukan
  const paidTagihanRW = await prisma.tagihan.findMany({
    where: {
      status: 'lunas',
      kk: {
        rt_id: { in: rtIds },
      },
    },
    include: {
      iuran: {
        select: { nominal: true },
      },
    },
  });

  // 3. Hitung total nominal iuran yang masuk
  let totalIuranRW = 0;
  for (const tagihan of paidTagihanRW) {
    if (tagihan.iuran?.nominal) {
      totalIuranRW += tagihan.iuran.nominal.toNumber();
    }
  }

  const formattedIuranRW = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(totalIuranRW);

  // --- Dummy pengumuman RW (nanti bisa dinamis kalau pakai tabel khusus) ---
  const pengumumanRW = [
    {
      id: 1,
      judul: 'Musyawarah Warga RW',
      isi: 'Sabtu, 20.00 WIB di Aula RW',
    },
    {
      id: 2,
      judul: 'Gotong Royong Mingguan',
      isi: 'Minggu, 06.00 pagi – lingkungan RW',
    },
  ];

  return (
    <main className="flex-1 p-6">
      {/* Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-700">Jumlah Warga</h3>
            <Users className="text-indigo-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800">{jumlahWarga}</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-700">Total Iuran RW</h3>
            <FileCheck2 className="text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800">{formattedIuranRW}</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-700">Pengumuman RW</h3>
            <Megaphone className="text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800">{pengumumanRW.length}</p>
        </div>
      </div>

      {/* Pengumuman */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Pengumuman RW Terbaru</h2>
        <div className="space-y-3">
          {pengumumanRW.length > 0 ? (
            pengumumanRW.map((p) => (
              <div key={p.id} className="p-4 bg-indigo-50 rounded-lg">
                <h3 className="font-semibold text-indigo-700">{p.judul}</h3>
                <p className="text-gray-600 text-sm">{p.isi}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">Tidak ada pengumuman untuk RW Anda.</p>
          )}
        </div>
      </div>
    </main>
  );
}
