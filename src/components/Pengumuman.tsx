'use client';

import { useState } from 'react';
import Link from 'next/link';
import CardPengumuman from '@/components/CardPengumuman';
import type { Pengumuman } from '@/lib/type/pengumuman';
import { Plus } from 'lucide-react';

type Props = {
  data: Pengumuman[];
  role: 'rt' | 'rw';
};

export default function Pengumuman({ data: initialData, role }: Props) {
  const [data, setData] = useState<Pengumuman[]>(initialData);
  const [selected, setSelected] = useState<Pengumuman | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [pengumumanToDelete, setPengumumanToDelete] = useState<Pengumuman | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-indigo-100 to-white py-10 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl text-center sm:text-left font-extrabold text-blue-900">
          Daftar Pengumuman
        </h1>
        <Link href={`/dashboard/${role}/pengumuman/tambah`}>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow transition-all duration-200">
            <Plus size={18} />
            Tambah
          </button>
        </Link>
      </div>

      {/* Grid daftar pengumuman */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {data.map((item) => (
          <CardPengumuman
            key={item.id}
            item={item}
            role={role}
            onDelete={() => {
              setShowConfirmDelete(true);
              setPengumumanToDelete(item);
            }}
            onClick={setSelected}
          />
        ))}
      </div>

      {/* Modal detail pengumuman */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl max-w-md w-full relative max-h-[80vh] overflow-y-auto animate-fade-in">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-4 text-gray-400 hover:text-red-500 text-xl transition"
              aria-label="Tutup"
            >
              ✕
            </button>
            <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-2">
              {selected.judul}
            </h2>
            {selected.subjek && (
              <p className="text-sm text-blue-600 italic mb-3">{selected.subjek}</p>
            )}
            <p className="text-gray-700 whitespace-pre-line leading-relaxed mb-4">
              {selected.isi || '-'}
            </p>
            <p className="text-sm text-gray-500 text-right">
              {selected.tanggal
                ? new Date(selected.tanggal).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'Tanggal tidak tersedia'}
            </p>
          </div>
        </div>
      )}

      {/* Modal konfirmasi hapus */}
      {showConfirmDelete && pengumumanToDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-2xl max-w-sm w-full shadow-xl animate-fade-in">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Yakin ingin menghapus pengumuman ini?
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              {pengumumanToDelete.judul}
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 text-sm rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
                onClick={() => {
                  setShowConfirmDelete(false);
                  setPengumumanToDelete(null);
                }}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700"
                onClick={async () => {
                  try {
                    const res = await fetch(`/api/pengumuman/${pengumumanToDelete.id}`, {
                      method: 'DELETE',
                    });
                    if (!res.ok) throw new Error('Gagal hapus');
                    setData(data.filter(item => item.id !== pengumumanToDelete.id));
                    setShowConfirmDelete(false);
                    setPengumumanToDelete(null);
                  } catch (err) {
                    console.error(err);
                  }
                }}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
