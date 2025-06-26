// Path: src/app/(rt)/dashboard/rt/riwayat-iuran/page.tsx
// Ini adalah Server Component, jadi tidak perlu 'use client'
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma'; // Pastikan path prisma benar
import { redirect } from 'next/navigation';
import StatusIuranRTTable from '@/components/Tables/StatusIuranRTTable'; // Import komponen tabel

export default async function RiwayatIuranRTPage() {
  const cookieStore = cookies(); // Menggunakan cookies dari next/headers
  const nik = cookieStore.get('nik')?.value;

  // Redirect jika NIK tidak ditemukan (belum login)
  if (!nik) {
    redirect('/login');
  }

  // Ambil data user dan RT ID dari database di sisi server
  const user = await prisma.user.findFirst({
    where: { nik },
    include: {
      warga: {
        include: { kk: true },
      },
    },
  });
  
  // Pastikan user ada dan memiliki role RT (role_id 3)
  if (!user || user.role_id !== 3) {
    redirect('/login');
  }
  
  const rtId = user?.warga?.kk?.rt_id;
  // Jika RT ID tidak ditemukan, tangani error atau redirect (misal: ke dashboard RT utama)
  if (!rtId) {
    // throw new Error('RT ID tidak ditemukan. Pastikan user memiliki relasi RT di KK nya.');
    redirect('/dashboard/rt'); 
  }

  return (
    <main className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto bg-white border border-gray-200 rounded-xl shadow-2xl p-6 sm:p-8">
        {/* Render komponen tabel dan lemparkan rtId sebagai prop */}
        <StatusIuranRTTable rtId={rtId} />
      </div>
    </main>
  );
}
