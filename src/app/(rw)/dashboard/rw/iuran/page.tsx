'use client';

import ListIuranRW from '@/components/Tables/ListIuranRW';
import { useRouter } from 'next/navigation';

export default function PageRWList() {
  const router = useRouter();

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      {/* Judul di tengah */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Daftar Iuran Bulanan (RW)</h1>
      </div>

      {/* Tombol tambah di kanan atas */}

      {/* Tabel scrollable */}
      <div className="overflow-x-auto">
        <ListIuranRW />
      </div>
    </main>
  );
}
