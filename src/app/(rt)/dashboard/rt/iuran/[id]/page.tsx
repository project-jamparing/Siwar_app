'use client'

// Hapus import BackButton karena sudah di dalam DetailPembayaranIuranRT
// import BackButton from '@/components/Buttons/BackButton' 
import DetailPembayaranIuranRT from '@/components/Tables/DetailPembayaranIuranRT'
import { useParams } from 'next/navigation' 

export default function DetailIuranRTPage() {
  const params = useParams() 
  const iuranId = parseInt(params.id as string) 

  if (isNaN(iuranId)) {
    // Penanganan jika ID bukan angka valid
    return (
      <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen font-sans flex items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 sm:p-8 text-center text-red-600 font-medium">
          ID Iuran tidak valid.
        </div>
      </div>
    );
  }

  return (
    // Gunakan p-6 dan background yang konsisten dengan halaman lain
    <main className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen font-sans">
      {/*
        Menghapus <BackButton /> dan <h1 /> dari sini karena
        sudah terintegrasi di dalam komponen DetailPembayaranIuranRT.
        Komponen DetailPembayaranIuranRT sudah memiliki styling container sendiri.
      */}
      <DetailPembayaranIuranRT iuranId={iuranId} />
    </main>
  )
}
