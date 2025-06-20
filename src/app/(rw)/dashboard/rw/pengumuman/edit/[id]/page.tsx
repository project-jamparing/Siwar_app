'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditPengumumanRW() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [judul, setJudul] = useState('');
  const [subjek, setSubjek] = useState('');
  const [isi, setIsi] = useState('');
  const [tanggal, setTanggal] = useState('');

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`/api/pengumuman/${id}`);
      if (!res.ok) return;
      const data = await res.json();
      setJudul(data.judul || '');
      setSubjek(data.subjek || '');
      setIsi(data.isi || '');
      setTanggal(data.tanggal?.split('T')[0] || '');
    }
    if (id) fetchData();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch(`/api/pengumuman/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ judul, subjek, isi, tanggal }),
      });
      if (!res.ok) throw new Error('Gagal update');
      router.push('/dashboard/rw/pengumuman');
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-indigo-100 to-white py-10 px-4 flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-6 sm:p-8 w-full max-w-2xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-yellow-700 text-center mb-6">
          Edit Pengumuman RW
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Judul</label>
            <input
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 text-gray-800"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Subjek</label>
            <input
              type="text"
              value={subjek}
              onChange={(e) => setSubjek(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 text-gray-800"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Isi</label>
            <textarea
              value={isi}
              onChange={(e) => setIsi(e.target.value)}
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 text-gray-800"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Tanggal</label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 text-gray-800"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
