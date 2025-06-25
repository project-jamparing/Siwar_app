// Path: src/app/(rw)/dashboard/rw/iuran/[id]/page.tsx
'use client'; // WAJIB ada ini karena menggunakan hooks seperti useParams, useState, useEffect

import { useParams } from 'next/navigation'; // Untuk mengambil ID dari URL
import BackButton from '@/components/Buttons/BackButton'; // Jika Anda punya tombol kembali
import DetailPembayaranIuranRWByIuran from '@/components/Tables/DetailPembayaranIuranRWByIuran'; // Import komponen tabel detail

export default function IuranDetailPage() {
  // Ambil ID iuran dari parameter URL
  const params = useParams();
  const iuranId = parseInt(params.id as string); 

  // Tampilkan pesan error jika ID tidak valid
  if (isNaN(iuranId)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 font-sans">
        <div className="p-8 bg-white rounded-xl shadow-lg text-center text-red-600 font-bold">
          <p className="text-xl">ID iuran tidak valid.</p>
        </div>
      </div>
    );
  }

  // Tampilan komponen halaman
  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100"> 
      <BackButton /> {/* Jika Anda menggunakan komponen BackButton */}
      {/* JUDUL DAN DESKRIPSI DI ATAS DIHAPUS, SEHINGGA HANYA JUDUL DARI KOMPONEN DETAIL YANG MUNCUL */}
      
      <DetailPembayaranIuranRWByIuran iuranId={iuranId} /> {/* Render komponen tabel detail */}
    </div>
  );
}
