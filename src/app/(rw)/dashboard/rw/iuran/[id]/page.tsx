// Path: src/app/(rw)/dashboard/rw/iuran/[id]/page.tsx
'use client'; // WAJIB ada ini karena menggunakan hooks seperti useParams, useState, useEffect

import { useParams } from 'next/navigation'; // Untuk mengambil ID dari URL
import BackButton from '@/components/Buttons/BackButton'; // Jika Anda punya tombol kembali
// --- GANTI IMPORT INI ---
// import DetailIuranRWModal from '@/components/Tables/DetailIuranRWModal'; // Ini yang lama
import DetailPembayaranIuranRWByIuran from '@/components/Tables/DetailPembayaranIuranRWByIuran'; // <--- IMPORT KOMPONEN BARU INI
// --- AKHIR GANTI IMPORT ---

export default function IuranDetailPage() {
  // Ambil ID iuran dari parameter URL
  const params = useParams();
  const iuranId = parseInt(params.id as string); 

  // Tampilkan pesan error jika ID tidak valid
  if (isNaN(iuranId)) {
    return <p className="p-4 text-red-500 text-center">ID iuran tidak valid.</p>;
  }

  // Tampilan komponen halaman
  return (
    <div className="p-6 max-w-7xl mx-auto"> {/* Ubah max-w-5xl ke max-w-7xl agar lebih lebar untuk tabel */}
      <BackButton /> {/* Jika Anda menggunakan komponen BackButton */}
      <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center">
        Detail Pembayaran Iuran untuk RW (ID: {iuranId})
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Berikut adalah status pembayaran warga untuk iuran ini dari seluruh wilayah RW Anda.
      </p>

      {/* --- GANTI KOMPONEN INI --- */}
      {/* <DetailIuranRWModal iuranId={iuranId} onClose={() => {}} /> // Ini yang lama */}
      <DetailPembayaranIuranRWByIuran iuranId={iuranId} /> {/* <--- RENDER KOMPONEN BARU INI */}
      {/* --- AKHIR GANTI KOMPONEN --- */}
    </div>
  );
}
