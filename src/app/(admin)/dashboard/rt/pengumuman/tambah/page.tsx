'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function TambahPengumuman() {
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
      body: JSON.stringify({ judul, subjek, isi, tanggal, rt_id: 3 }),
    });

    if (res.ok) {
      router.push('/dashboard/rt/pengumuman');  // langsung balik ke halaman pengumuman
    } else {
      alert('Gagal tambah pengumuman');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <input
        type="text"
        placeholder="Judul"
        value={judul}
        onChange={(e) => setJudul(e.target.value)}
        required
        className="border p-2 w-full mb-3 text-gray-600"
      />
      <input
        type="text"
        placeholder="Subjek"
        value={subjek}
        onChange={(e) => setSubjek(e.target.value)}
        required
        className="border p-2 w-full mb-3 text-gray-600"
      />
      <textarea
        placeholder="Isi pengumuman"
        value={isi}
        onChange={(e) => setIsi(e.target.value)}
        required
        className="border p-2 w-full mb-3t text-gray-600"
      />
      <input
        type="date"
        value={tanggal}
        onChange={(e) => setTanggal(e.target.value)}
        required
        className="border p-2 w-full mb-3 text-gray-600"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Tambah
      </button>
    </form>
  );
}
