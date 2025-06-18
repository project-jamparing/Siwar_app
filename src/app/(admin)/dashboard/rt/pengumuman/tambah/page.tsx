'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function TambahPengumuman() {
  const router = useRouter();
  const [judul, setJudul] = useState('');
  const [subjek, setSubjek] = useState('');
  const [isi, setIsi] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [rtId, setRtId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchRtId() {
      try {
        const res = await fetch('/api/pengumuman?get=rt', { cache: 'no-store' });
        const data = await res.json();
        setRtId(data.rt_id);
      } catch (err) {
        console.error('Gagal ambil rt_id:', err);
      }
    }

    fetchRtId();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!rtId) {
      alert('RT ID belum tersedia');
      return;
    }

    const res = await fetch('/api/pengumuman', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        judul,
        subjek,
        isi,
        tanggal,
        rt_id: rtId,
        role: 'rt',
      }),
    });

    if (res.ok) {
      router.push('/dashboard/rt/pengumuman');
    } else {
      alert('Gagal tambah pengumuman');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-indigo-100 to-white flex items-center justify-center px-4 py-10">
      <div className="bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-2xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-800 text-center mb-6">
          Tambah Pengumuman RT
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Judul */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Judul</label>
            <input
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              required
              className="w-full border text-gray-900 border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          {/* Subjek */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Subjek</label>
            <input
              type="text"
              value={subjek}
              onChange={(e) => setSubjek(e.target.value)}
              required
              className="w-full border text-gray-900 border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          {/* Isi */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Isi</label>
            <textarea
              value={isi}
              onChange={(e) => setIsi(e.target.value)}
              rows={5}
              required
              className="w-full border text-gray-900 border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          {/* Tanggal */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Tanggal</label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              required
              className="w-full border text-gray-900 border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg"
            >
              Tambah
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
