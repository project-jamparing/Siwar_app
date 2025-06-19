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
  <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-5 text-sm w-full max-w-md mx-auto">
    {/* Header & Actions */}
    <div className="flex justify-between items-start mb-2">
      <h2 className="font-semibold text-blue-800 text-base sm:text-lg line-clamp-1">
        {item.judul}
      </h2>

      <div className="flex gap-2">
        <button
          onClick={() => onClick(item)}
          title="Lihat detail"
          className="p-2 rounded-lg text-blue-600 hover:bg-blue-100 hover:text-blue-800 transition"
        >
          <Eye size={18} />
        </button>

        <Link href={`/dashboard/${role}/pengumuman/edit/${item.id}`} passHref>
          <button
            title="Edit"
            className="p-2 rounded-lg text-yellow-600 hover:bg-yellow-100 hover:text-yellow-800 transition"
          >
            <Pencil size={18} />
          </button>
        </Link>

        <button
          onClick={() => onDelete(item)}
          title="Hapus"
          className="p-2 rounded-lg text-red-600 hover:bg-red-100 hover:text-red-800 transition"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>

    {/* Subjek */}
    {item.subjek && (
      <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 italic mb-2">
        {item.subjek}
      </p>
    )}

    {/* Footer Info */}
    <p className="text-gray-500 text-xs sm:text-sm">
      {item.rt_id === null ? 'RW' : `RT ${item.rt_id}`} •{' '}
      {new Date(item.tanggal).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })}
    </p>
  </div>
);

export default CardPengumuman;
