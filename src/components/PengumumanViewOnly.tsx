'use client';

import { useState } from 'react';

type Pengumuman = {
  id: number;
  judul: string;
  subjek: string;
  isi: string;
  tanggal: Date;
};

type Props = {
  data: Pengumuman[];
};

export default function PengumumanViewOnly({ data }: Props) {
  const [selected, setSelected] = useState<Pengumuman | null>(null);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Daftar Pengumuman</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelected(item)}
            className="bg-white rounded-xl shadow p-4 hover:bg-gray-100 cursor-pointer"
          >
            <h2 className="text-lg font-semibold text-gray-800">{item.judul}</h2>
            <p className="text-sm text-gray-500">
              {new Date(item.tanggal).toISOString().slice(0, 10)}
            </p>

            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.isi}</p>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow max-w-md w-full">
            <h2 className="text-xl font-semibold text-gray-800">{selected.judul}</h2>
            <p className="text-sm text-gray-500 mb-1">
              {new Date(selected.tanggal).toLocaleDateString()}
            </p>
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
