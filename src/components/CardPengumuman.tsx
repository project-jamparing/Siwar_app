'use client';

import { FC } from 'react';
import Link from 'next/link';

type Pengumuman = {
  id: number;
  judul: string;
  isi: string;
  rt_id: number;
  rukun_tetangga?: {
    id: number;
    nama: string;
  };
};

type Props = {
  item: Pengumuman;
  onDelete: (id: number) => void;
  onClick: (item: Pengumuman) => void;
};

const CardPengumuman: FC<Props> = ({ item, onDelete, onClick }) => (
  <div className="bg-white border border-gray-200 rounded-2xl shadow hover:shadow-md transition-all p-5 w-full max-w-sm">
    <h2 className="text-xl font-semibold text-gray-800 mb-2">{item.judul}</h2>
    <p className="text-gray-600 text-sm mb-4">
      {item.isi.length > 100 ? item.isi.slice(0, 100) + '...' : item.isi}
    </p>
    <p className="text-xs text-gray-500 mb-2">
       {item.rukun_tetangga?.nama || 'Tidak diketahui'}
    </p>
    <div className="flex gap-2 justify-end">
      <button
        onClick={() => onClick(item)}
        className="text-blue-600 hover:text-blue-800 text-sm px-3 py-1 rounded hover:bg-blue-50"
      >
        Lihat
      </button>
      <Link href={`/dashboard/rt/pengumuman/edit/${item.id}`}>
        <button className="text-yellow-600 hover:text-yellow-800 text-sm px-3 py-1 rounded hover:bg-yellow-50">
          Edit
        </button>
      </Link>
      <button
        onClick={() => {
          if (confirm(`Yakin mau hapus pengumuman "${item.judul}"?`)) {
            onDelete(item.id);
          }
        }}
        className="text-red-600 hover:text-red-800 text-sm px-3 py-1 rounded hover:bg-red-50"
      >
        Hapus
      </button>
    </div>
  </div>
);

export default CardPengumuman;
