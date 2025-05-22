'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TambahPengumuman() {
  const router = useRouter();
  const [judul, setJudul] = useState('');
  const [subjek, setSubjek] = useState('');
  const [isi, setIsi] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!judul || !tanggal) {
      setError('Judul dan tanggal wajib diisi');
      return;
    }

    const data = { judul, subjek, isi, tanggal, rt_id: 1 };

    try {
      const res = await fetch('/api/pengumuman', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || 'Gagal tambah pengumuman');
        return;
      }

      router.push('/dashboard/rt/pengumuman');
    } catch {
      setError('Terjadi kesalahan');
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4 text-black">Tambah Pengumuman</h1>
      {error && <p className="mb-4 text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="judul" className="block font-semibold mb-1 text-black">Judul *</label>
          <input
            id="judul"
            type="text"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            className="w-full border px-3 py-2 rounded text-black"
            required
          />
        </div>

        <div>
          <label htmlFor="subjek" className="block font-semibold mb-1 text-black">Subjek</label>
          <input
            id="subjek"
            type="text"
            value={subjek}
            onChange={(e) => setSubjek(e.target.value)}
            className="w-full border px-3 py-2 rounded text-black"
          />
        </div>

        <div>
          <label htmlFor="isi" className="block font-semibold mb-1 text-black">Isi</label>
          <textarea
            id="isi"
            value={isi}
            onChange={(e) => setIsi(e.target.value)}
            className="w-full border px-3 py-2 rounded text-black"
            rows={4}
          />
        </div>

        <div>
          <label htmlFor="tanggal" className="block font-semibold mb-1 text-black">Tanggal *</label>
          <input
            id="tanggal"
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            className="w-full border px-3 py-2 rounded text-black"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-black px-4 py-2 rounded hover:bg-blue-700"
        >
          Simpan
        </button>
      </form>
    </div>
  );
}
