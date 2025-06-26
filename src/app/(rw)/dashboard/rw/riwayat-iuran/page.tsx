// Path: src/app/(rw)/dashboard/rw/riwayat-iuran/page.tsx
'use client'; // WAJIB ada ini karena komponen yang di-import adalah client component

import BackButton from '@/components/Buttons/BackButton'; // Jika Anda punya tombol kembali
import RiwayatPembayaranWargaRW from '@/components/Tables/RiwayatPembayaranWargaRW'; // <-- IMPORT KOMPONEN BARU INI

export default function RiwayatIuranRWPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* BackButton ini opsional, tergantung tata letak Anda */}
      {/* <BackButton /> */}

      {/* Render (tampilkan) komponen tabel riwayat pembayaran warga untuk RW */}
      <RiwayatPembayaranWargaRW />
    </div>
  );
}