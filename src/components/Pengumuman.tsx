'use client';

import { useState } from 'react';
import CardPengumuman from './CardPengumuman';

type PengumumanItem = {
  id: number;
  tanggal: string;
  judul: string;
  subjek: string;
  isi: string;
};

type Props = {
  data: PengumumanItem[];
};

export default function Pengumuman({ data }: Props) {
  const [selected, setSelected] = useState<PengumumanItem | null>(null);

  return (
    <div className="relative p-6">
      <h1 className="text-2xl font-bold mb-6">Daftar Pengumuman</h1>

      <div className="flex flex-wrap gap-4">
        {data.map((item) => (
          <CardPengumuman key={item.id} item={item} onClick={setSelected} />
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg relative text-black">
            <h2 className="text-xl font-semibold mb-2">{selected.judul}</h2>
            <p className="text-sm text-gray-800 mb-2">{selected.subjek}</p>
            <p className="text-sm text-gray-700 mb-4">{selected.tanggal}</p>
            <p className="mb-4">{selected.isi}</p>
            <button
              onClick={() => setSelected(null)}
              className="bg-blue-600 text-black px-4 py-2 rounded hover:bg-blue-700"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
