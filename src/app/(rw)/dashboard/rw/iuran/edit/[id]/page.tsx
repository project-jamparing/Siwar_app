// Path: src/app/(rw)/dashboard/rw/iuran/edit/[id]/page.tsx
'use client'; // WAJIB ada ini karena menggunakan hooks seperti useParams

import { useParams } from 'next/navigation'; // Untuk mengambil ID dari URL
// Import komponen form yang baru kita buat
import EditIuranFormRW from '@/components/Forms/EditIuranFormRW'; 

export default function EditIuranPage() {
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
  // Wrapper div ini mempertahankan background gradient biru-muda untuk seluruh halaman
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6 font-sans">
      {/* Render komponen form edit, lemparkan iuranId sebagai prop */}
      <EditIuranFormRW iuranId={iuranId} /> 
    </div>
  );
}
