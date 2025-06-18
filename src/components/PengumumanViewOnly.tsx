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
    <div className="relative min-h-screen overflow-hidden">
      {/* BACKGROUND GRADIENT */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-200 via-white to-blue-100" />

      {/* CONTAINER */}
      <div className="px-6 py-12 max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-12 tracking-tight">
          📢 Daftar Pengumuman
        </h1>

        {/* GRID */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelected(item)}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl border border-gray-200 p-6 transition-all duration-300 cursor-pointer hover:ring-2 hover:ring-indigo-400 group"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-1 group-hover:underline">
                {item.judul || 'Tanpa Judul'}
              </h2>

              <p className="text-xs text-gray-400 mb-2">
                {new Date(item.tanggal).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>

              <p className="text-sm text-gray-600 line-clamp-3">
                {item.isi || 'Tidak ada isi'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center px-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full relative animate-fade-in transition-all duration-300">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl"
              aria-label="Tutup"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">{selected.judul}</h2>

            {selected.subjek && (
              <p className="text-sm text-indigo-600 italic mb-2">{selected.subjek}</p>
            )}

            <p className="text-gray-700 mt-3 whitespace-pre-line leading-relaxed">
              {selected.isi}
            </p>

            <p className="text-sm text-gray-500 mt-6 text-right">
              {new Date(selected.tanggal).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
