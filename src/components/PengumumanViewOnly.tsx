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
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Daftar Pengumuman</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelected(item)}
            className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg hover:ring-2 hover:ring-blue-500 transition-all duration-200 cursor-pointer"
          >
            <h2 className="text-lg font-bold text-gray-800 mb-1">{item.judul}</h2>

            <p className="text-sm text-gray-600 mt-1 line-clamp-3">{item.isi}</p>
            <p className="text-xs text-gray-400 mb-2">
              {new Date(item.tanggal).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full relative animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{selected.judul}</h2>
            <p className="text-sm text-gray-600 italic mb-2">{selected.subjek}</p>
            <p className="text-gray-700 mt-3 whitespace-pre-line">{selected.isi}</p>
            <p className="text-sm text-gray-500">
              {new Date(selected.tanggal).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
