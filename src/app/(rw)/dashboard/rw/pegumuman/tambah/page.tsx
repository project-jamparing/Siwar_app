'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TambahPengumumanRW() {
  const router = useRouter();

  const [judul, setJudul] = useState('');
  const [subjek, setSubjek] = useState('');
  const [isi, setIsi] = useState('');
  const [tanggal, setTanggal] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch('/api/pengumuman', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        judul,
        subjek,
        isi,
        tanggal,
        role: 'rw', // ✅ Fix utama di sini
      }),
    });

    if (res.ok) {
      router.push('/dashboard/rw/pengumuman');
    } else {
      alert('Gagal tambah pengumuman');
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white border border-gray-200 rounded-xl shadow space-y-6"
    >
      <h1 className="text-2xl font-bold text-gray-800">Tambah Pengumuman RW</h1>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
        <input
          type="text"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 text-gray-900 rounded-lg"
          placeholder="Contoh: Rapat Koordinasi"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Subjek</label>
        <input
          type="text"
          value={subjek}
          onChange={(e) => setSubjek(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 text-gray-900 rounded-lg"
          placeholder="Contoh: Rapat Bulanan"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Isi Pengumuman</label>
        <textarea
          value={isi}
          onChange={(e) => setIsi(e.target.value)}
          required
          rows={5}
          className="w-full p-3 border border-gray-300 text-gray-900 rounded-lg"
          placeholder="Isi detail pengumuman di sini..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
        <input
          type="date"
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 text-gray-900 rounded-lg"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-all"
      >
        Tambah Pengumuman
      </button>
    </form>
  );
}

