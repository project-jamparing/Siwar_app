'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TambahPengumumanRW() {
  const [judul, setJudul] = useState('');
  const [subjek, setSubjek] = useState('');
  const [isi, setIsi] = useState('');
  const [tanggal, setTanggal] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/pengumuman', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          judul,
          subjek,
          isi,
          tanggal,
          role: 'rw', // ⬅️ WAJIB ADA!
        }),
      });

      if (!res.ok) throw new Error('Gagal tambah');

      router.push('/dashboard/rw/pengumuman');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Tambah Pengumuman RW</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Judul</label>
          <input
            type="text"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            className="w-full border text-gray-600 border-gray-300 rounded-lg px-4 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Subjek</label>
          <input
            type="text"
            value={subjek}
            onChange={(e) => setSubjek(e.target.value)}
            className="w-full border text-gray-600 border-gray-300 rounded-lg px-4 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Isi</label>
          <textarea
            value={isi}
            onChange={(e) => setIsi(e.target.value)}
            className="w-full border text-gray-600 border-gray-300 rounded-lg px-4 py-2"
            rows={6}
            required
          />
          <input
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            required
            className="border p-2 text-sm w-full mb-3 text-gray-600"
          />  
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}
