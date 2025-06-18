'use client';

import { FC } from 'react';
import Link from 'next/link';
import { Pengumuman } from '@/lib/type/pengumuman';
import { Eye, Pencil, Trash2 } from 'lucide-react';

type Props = {
  item: Pengumuman;
  role: 'rt' | 'rw'; // tambah ini
  onDelete: (item: Pengumuman) => void;
  onClick: (item: Pengumuman) => void;
};

const CardPengumuman: FC<Props> = ({ item, role, onDelete, onClick }) => (
  <div className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-5 w-full max-w-sm">
    <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 truncate">
      {item.judul}
    </h2>

    <p className="text-gray-600 text-sm mb-3 line-clamp-3">{item.subjek}</p>

    <p className="text-sm text-gray-500">
      {item.rt_id === null ? 'RW' : `RT ${item.rt_id}`}
    </p>


    <div className="flex flex-wrap gap-2 justify-end">
      <button
        onClick={() => onClick(item)}
        className="text-sm font-medium text-blue-600 hover:text-white hover:bg-blue-600 px-3 py-1 rounded-lg transition-all"
      >
        <Eye size={18} />
      </button>

      <Link href={`/dashboard/${role}/pengumuman/edit/${item.id}`}>
        <button className="text-sm font-medium text-yellow-600 hover:text-white hover:bg-yellow-500 px-3 py-1 rounded-lg transition-all">
          <Pencil size={18} />
        </button>
      </Link>

      <button
        onClick={() => onDelete(item)}
        className="text-sm font-medium text-red-600 hover:text-white hover:bg-red-600 px-3 py-1 rounded-lg transition-all"
      >
        <Trash2 size={18} />
      </button>
    </div>
  </div>
);

export default CardPengumuman;
