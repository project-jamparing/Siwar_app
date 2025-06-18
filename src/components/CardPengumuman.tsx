'use client';

import { FC } from 'react';
import Link from 'next/link';
import { Pengumuman } from '@/lib/type/pengumuman';
import { Eye, Pencil, Trash2 } from 'lucide-react';

type Props = {
  item: Pengumuman;
  onDelete: (item: Pengumuman) => void;
  onClick: (item: Pengumuman) => void;
  role: 'rt' | 'rw';
};

const CardPengumuman: FC<Props> = ({ item, onDelete, onClick, role }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-5 w-full max-w-sm">
      {/* Judul */}
      <h2 className="text-xl font-semibold text-gray-900 mb-1 truncate">
        {item.judul || 'Tanpa judul'}
      </h2>

      {/* Subjek */}
      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
        {item.subjek || 'Tanpa subjek'}
      </p>

      {/* Info RT */}
      <p className="text-xs text-gray-500 italic mb-4">
        {item.rukun_tetangga?.nama ? `RT ${item.rukun_tetangga.nama}` : 'RW'}
      </p>

      {/* Divider */}
      <div className="border-t border-gray-100 my-3" />

      {/* Tombol Aksi */}
      <div className="flex justify-end gap-2">
        <button
          onClick={() => onClick(item)}
          className="p-2 rounded-md border border-blue-500 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200"
          title="Lihat detail"
        >
          <Eye size={16} />
        </button>

        <Link href={`/dashboard/${role}/pengumuman/edit/${item.id}`}>
          <button
            className="p-2 rounded-md border border-yellow-400 text-yellow-500 hover:bg-yellow-400 hover:text-white transition-all duration-200"
            title="Edit"
          >
            <Pencil size={16} />
          </button>
        </Link>

        <button
          onClick={() => onDelete(item)}
          className="p-2 rounded-md border border-red-500 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200"
          title="Hapus"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default CardPengumuman;
