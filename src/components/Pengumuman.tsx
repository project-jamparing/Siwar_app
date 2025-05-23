'use client';

import { useState } from 'react';
import Link from 'next/link';
import CardPengumuman from '@/components/CardPengumuman';

type Pengumuman = {
  id: number;
  judul: string;
  subjek: string;
  isi: string;
  tanggal: string;
};

type Props = {
  data: Pengumuman[];
};

export default function Pengumuman({ data: initialData }: Props) {
  const [data, setData] = useState(initialData);
  const [selected, setSelected] = useState<Pengumuman | null>(null);

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Daftar Pengumuman</h1>
        <Link href="/dashboard/rt/pengumuman/tambah">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow">
            + Tambah
          </button>
        </Link>
      </div>

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

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow max-w-md w-full">
            <h2 className="text-xl font-semibold text-gray-800">{selected.judul}</h2>
            <p className="text-sm text-gray-500 mb-1">{selected.subjek}</p>
            <p className="text-gray-700 mt-2 whitespace-pre-line">{selected.isi}</p>
            <button
              onClick={() => setSelected(null)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
