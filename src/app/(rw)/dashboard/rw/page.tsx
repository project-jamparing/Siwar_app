import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Users, FileCheck2, Megaphone } from 'lucide-react';
import Link from 'next/link';
import type { Pengumuman } from '@/lib/type/pengumuman';

export default async function RWPage() {
  const cookie = await cookies();
  const nik = cookie.get('nik')?.value;

  if (!nik) redirect('/login');

  const user = await prisma.user.findFirst({
    where: { nik },
    include: { warga: true },
  });

  if (!user || user.role_id !== 2) redirect('/login');

  const userName =
    user.warga?.nama && user.warga.nama.trim() !== ''
      ? user.warga.nama
      : 'Warga ' + user.nik;

  const warga = await prisma.warga.findMany();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/pengumuman?terbaru=true&role=rw&nik=${nik}`,
    { cache: 'no-store' }
  );
  const { data: pengumumanTerbaru } = await res.json();
  
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
          <p className="text-3xl font-bold text-gray-800">{formattedIuranRW}</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-700">Pengumuman Aktif</h3>
            <Megaphone className="text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800">{pengumumanTerbaru.length}</p>
        </div>
      </div>

      {/* Pengumuman Terbaru */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Pengumuman RW Terbaru</h2>
        <div className="space-y-3">
          {pengumumanTerbaru.length === 0 ? (
            <p className="text-gray-500">Tidak ada pengumuman 2 hari terakhir</p>
          ) : (
            pengumumanTerbaru.map((item: Pengumuman) => (
              <Link
                key={item.id}
                href={`/dashboard/rw/pengumuman?selected=${item.id}`}
                className="block"
              >
                <div className="p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition">
                  <h3 className="font-semibold text-indigo-700">{item.judul}</h3>
                  <p className="text-gray-600 text-sm">{item.subjek}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
