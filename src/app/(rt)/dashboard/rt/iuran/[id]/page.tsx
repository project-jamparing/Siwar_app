'use client'

import BackButton from '@/components/Buttons/BackButton'
import DetailPembayaranIuranRT from '@/components/Tables/DetailPembayaranIuranRT'
import { useParams } from 'next/navigation' // <-- Import useParams

// Props sudah tidak diperlukan lagi jika menggunakan useParams
// interface Props {
//   params: { id: string }
// }

// Hapus parameter props { params } karena kita akan menggunakan hook
export default function DetailIuranRTPage() {
  const params = useParams() // <-- Panggil hook useParams
  const iuranId = parseInt(params.id as string) // <-- Akses params.id dari hook, tambahkan `as string` untuk type safety

  if (isNaN(iuranId)) {
    // Penanganan jika ID bukan angka valid
    return <div className="p-6 max-w-5xl mx-auto">ID Iuran tidak valid.</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <BackButton />
      <h1 className="text-xl font-bold mb-4">Detail Iuran RT - ID {iuranId}</h1>
      {/* Pastikan DetailPembayaranIuranRT adalah komponen client atau ambil datanya di sini */}
      <DetailPembayaranIuranRT iuranId={iuranId} />
    </div>
  )
}