'use client';

import { FC } from 'react';
import Link from 'next/link';
import { Pengumuman } from '@/lib/type/pengumuman';

type Props = {
  item: Pengumuman;
  onDelete: (item: Pengumuman) => void;
  onClick: (item: Pengumuman) => void;
};

const CardPengumuman: FC<Props> = ({ item, onDelete, onClick }) => (
  <div className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-5 w-full max-w-sm">
    <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 truncate">
      {item.judul}
    </h2>

    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
      {item.subjek}
    </p>

    <p className="text-xs text-gray-500 italic mb-4">
      {item.rukun_tetangga?.nama ?? 'RT tidak diketahui'}
    </p>

    <div className="flex flex-wrap gap-2 justify-end">
      <button
        onClick={() => onClick(item)}
        className="text-sm font-medium text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-600 px-3 py-1 rounded-lg transition-all"
      >
        Lihat
      </button>

      <Link href={`/dashboard/rt/pengumuman/edit/${item.id}`}>
        <button className="text-sm font-medium text-yellow-600 hover:text-white hover:bg-yellow-500 border border-yellow-500 px-3 py-1 rounded-lg transition-all">
          Edit
        </button>
      </Link>

      <button
        onClick={() => onDelete(item)}
        className="text-sm font-medium text-red-600 hover:text-white hover:bg-red-600 border border-red-600 px-3 py-1 rounded-lg transition-all"
      >
        Hapus
      </button>

    </div>
  </div>
);

export default CardPengumuman;
