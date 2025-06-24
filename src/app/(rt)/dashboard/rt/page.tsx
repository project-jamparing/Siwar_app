// Path: src\app\(rt)\dashboard\rt\page.tsx

import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import {
  Users,
  FileCheck2,
  Megaphone,
} from 'lucide-react';

export default async function RTPage() {
  const cookie = await cookies();
  const nik = cookie.get('nik')?.value;

  if (!nik) {
    redirect('/login');
  }

  const user = await prisma.user.findFirst({
    where: { nik },
    include: {
      warga: {
        include: { kk: true },
      },
    },
  });
  
  if (!user || user.role_id !== 3) {
    redirect('/login');
  }
  
  const rtId = user?.warga?.kk?.rt_id;
  if (!rtId) {
    throw new Error('RT ID tidak ditemukan. Pastikan user memiliki relasi RT di KK nya.');
  }
  
  // Ambil semua no_kk di RT tersebut
  const kks = await prisma.kk.findMany({
    where: { rt_id: rtId },
    select: { no_kk: true },
  });
  const noKkList = kks.map(k => k.no_kk);
  
  // Ambil warga yang no_kk-nya ada di RT
  const wargaRT = await prisma.warga.findMany({
    where: {
      no_kk: { in: noKkList },
    },
  });
  
  const jumlahWarga = wargaRT.length;  

  // --- START PERUBAHAN UNTUK IURAN MASUK (MEMPERBAIKI ERROR AGGREGATE) ---
  const paidTagihan = await prisma.tagihan.findMany({
    where: {
      status: 'lunas', // Hanya yang berstatus 'lunas'
      kk: { // Filter tagihan berdasarkan KK yang ada di RT ini
        rt_id: rtId,
      },
    },
    include: { // Kita perlu meng-include iuran untuk mendapatkan nominalnya
      iuran: {
        select: {
          nominal: true,
        },
      },
    },
  });

  // Lakukan penjumlahan secara manual di JavaScript
  let totalIuranMasuk = 0;
  for (const tagihan of paidTagihan) {
    if (tagihan.iuran && tagihan.iuran.nominal) {
      // Pastikan nominal adalah Decimal.js object, lalu konversi ke Number
      totalIuranMasuk += tagihan.iuran.nominal.toNumber();
    }
  }

  // Format ke Rupiah
  const formattedIuranMasuk = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0, 
    maximumFractionDigits: 0,
  }).format(totalIuranMasuk);
  // --- END PERUBAHAN UNTUK IURAN MASUK ---

  // --- START PERUBAHAN UNTUK PENGUMUMAN AKTIF ---
  const pengumumanAktif = await prisma.pengumuman.count({
    where: {
      rt_id: rtId,
      // Jika ada kolom status di pengumuman (misal 'aktif'), tambahkan di sini
      // status: 'aktif',
    },
  });

  const pengumumanTerbaru = await prisma.pengumuman.findMany({
    where: {
      rt_id: rtId,
      // status: 'aktif', // Tambahkan jika ada status
    },
    orderBy: {
      tanggal: 'desc', 
    },
    take: 2, 
  });
  // --- END PERUBAHAN UNTUK PENGUMUMAN AKTIF ---

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
            <h3 className="text-lg font-semibold text-gray-700">Iuran Masuk</h3>
            <FileCheck2 className="text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800">{formattedIuranMasuk}</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-700">Pengumuman Aktif</h3>
            <Megaphone className="text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800">{pengumumanAktif}</p>
        </div>
      </div>

      {/* Pengumuman */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Pengumuman Terbaru</h2>
        <div className="space-y-3">
          {pengumumanTerbaru.length > 0 ? (
            pengumumanTerbaru.map((pengumuman) => (
              <div key={pengumuman.id} className="p-4 bg-indigo-50 rounded-lg">
                <h3 className="font-semibold text-indigo-700">{pengumuman.judul}</h3>
                <p className="text-gray-600 text-sm">
                  {pengumuman.isi} {pengumuman.tanggal ? `(${new Date(pengumuman.tanggal).toLocaleDateString('id-ID')})` : ''}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">Tidak ada pengumuman terbaru untuk RT Anda.</p>
          )}
        </div>
      </div>
    </main>
  );
}