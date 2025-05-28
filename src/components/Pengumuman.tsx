'use client';

import { useState } from 'react';
import Link from 'next/link';
import CardPengumuman from '@/components/CardPengumuman';
import { Pengumuman as PengumumanType } from '@/lib/type/pengumuman';
import { Plus } from 'lucide-react'; // Icon (opsional)

type Props = {
  data: PengumumanType[];
};

export default function Pengumuman({ data: initialData }: Props) {
  const [data, setData] = useState(initialData);
  const [selected, setSelected] = useState<PengumumanType | null>(null);

  async function handleDelete(id: number) {
    try {
      const res = await fetch(`/api/pengumuman/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal hapus');
      setData(data.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">📢 Daftar Pengumuman</h1>
        <Link href="/dashboard/rt/pengumuman/tambah">
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow transition">
            <Plus size={18} />
            Tambah
          </button>
        </Link>
      </div>

      {/* Grid daftar pengumuman */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((item) => (
          <CardPengumuman
            key={item.id}
            item={item}
            onDelete={handleDelete}
            onClick={setSelected}
          />
        ))}
      </div>

      {/* Modal detail pengumuman */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full relative animate-fade-in">
            {/* Tombol close */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
              aria-label="Tutup"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-1">{selected.judul}</h2>
            <p className="text-sm text-gray-500">
              {new Date(selected.tanggal).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <p className="text-sm text-gray-500 italic mb-2">{selected.subjek}</p>
            <p className="text-gray-700 mt-3 whitespace-pre-line">{selected.isi}</p>

            <button
              onClick={() => setSelected(null)}
              className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
