'use client';

import { FC } from 'react';
import Link from 'next/link';
import { Pengumuman } from '@/lib/type/pengumuman';
import { Eye, Pencil, Trash2 } from 'lucide-react';

type Props = {
  item: Pengumuman;
  role: 'rt' | 'rw';
  onDelete: (item: Pengumuman) => void;
  onClick: (item: Pengumuman) => void;
};

const CardPengumuman: FC<Props> = ({ item, role, onDelete, onClick }) => (
  <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 w-full max-w-md mx-auto">
    <h2 className="text-lg sm:text-xl font-semibold text-blue-800 mb-1 truncate">
      {item.judul}
    </h2>

    <p className="text-sm text-gray-600 line-clamp-2 mb-2">{item.subjek}</p>

    <p className="text-xs text-gray-500 mb-4">
      {item.rt_id === null ? 'RW' : `RT ${item.rt_id}`}
    </p>

    <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 mt-4">
      <button
        onClick={() => onClick(item)}
        title="Lihat detail"
        className="p-2 rounded-lg text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
      >
        <Eye size={18} />
      </button>

      <Link href={`/dashboard/${role}/pengumuman/edit/${item.id}`} passHref>
        <button
          title="Edit"
          className="p-2 rounded-lg text-yellow-600 hover:bg-yellow-500 hover:text-white transition-all"
        >
          <Pencil size={18} />
        </button>
      </Link>

      <button
        onClick={() => onDelete(item)}
        title="Hapus"
        className="p-2 rounded-lg text-red-600 hover:bg-red-600 hover:text-white transition-all"
      >
        <Trash2 size={18} />
      </button>
    </div>
  </div>
);

export default CardPengumuman;
