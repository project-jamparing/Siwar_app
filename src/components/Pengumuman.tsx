'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import CardPengumuman from '@/components/CardPengumuman';
import type { Pengumuman } from '@/lib/type/pengumuman';
import { Plus } from 'lucide-react';

type Props = {
  data: Pengumuman[];
  role: 'rt' | 'rw';
};

export default function PengumumanComponent({ data: initialData, role }: Props) {
  const [data, setData] = useState<Pengumuman[]>(initialData);
  const [selected, setSelected] = useState<Pengumuman | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [pengumumanToDelete, setPengumumanToDelete] = useState<Pengumuman | null>(null);

  // Ambil data ulang berdasarkan role dan nik
  useEffect(() => {
    const fetchData = async () => {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) return;

      const parsed = JSON.parse(storedUser);
      const nik = parsed?.nik;
      if (!nik) return;

      try {
        const res = await fetch(`/api/pengumuman?role=${role}&nik=${nik}&terbaru=true`);
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error('Gagal ambil data pengumuman:', err);
      }
    };

    fetchData();
  }, [role]);

  const handleDelete = async () => {
    if (!pengumumanToDelete) return;
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-50">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Daftar Pengumuman
          </h1>
          <Link href={`/dashboard/${role}/pengumuman/tambah`}>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-all">
              <Plus size={18} />
              Tambah
            </button>
          </Link>
        </div>

        {/* Grid daftar pengumuman */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((item) => (
            <CardPengumuman
              key={item.id}
              item={item}
              onDelete={() => {
                setShowConfirmDelete(true);
                setPengumumanToDelete(item);
              }}
              onClick={setSelected}
              role={role}
            />
          ))}
        </div>
      </div>

      {/* Modal detail pengumuman */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full relative animate-fade-in transition-all duration-300">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
              aria-label="Tutup"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {selected.judul}
            </h2>
            {selected.subjek && (
              <p className="text-sm text-blue-600 italic mb-2">{selected.subjek}</p>
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

      {/* Modal konfirmasi hapus */}
      {showConfirmDelete && pengumumanToDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-md max-w-sm w-full animate-fade-in transition-all">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Yakin ingin menghapus pengumuman ini?
            </h3>
            <p className="text-sm text-gray-600 mb-6">{pengumumanToDelete.judul}</p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 text-sm rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                onClick={() => {
                  setShowConfirmDelete(false);
                  setPengumumanToDelete(null);
                }}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                onClick={handleDelete}
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
