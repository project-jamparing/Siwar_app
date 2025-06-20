'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type FormTambahPengumumanProps = {
  role: 'rw' | 'rt';
  redirectPath: string;
  fetchRtId?: boolean;
};

export default function FormTambahPengumuman({
  role,
  redirectPath,
  fetchRtId = false,
}: FormTambahPengumumanProps) {
  const router = useRouter();
  const [judul, setJudul] = useState('');
  const [subjek, setSubjek] = useState('');
  const [isi, setIsi] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [rtId, setRtId] = useState<number | null>(null);

  useEffect(() => {
    if (fetchRtId) {
      async function fetchRtIdApi() {
        try {
          const res = await fetch('/api/pengumuman?get=rt', { cache: 'no-store' });
          const data = await res.json();
          setRtId(data.rt_id);
        } catch (err) {
          console.error('Gagal ambil rt_id:', err);
        }
      }

      fetchRtIdApi();
    }
  }, [fetchRtId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (fetchRtId && !rtId) {
      alert('RT ID belum tersedia');
      return;
    }

    const fullTanggal = new Date(`${tanggal}T${new Date().toTimeString().slice(0, 8)}`);

    const payload: any = {
      judul,
      subjek,
      isi,
      tanggal: fullTanggal,
      role,
    };

    if (fetchRtId) {
      payload.rt_id = rtId;
    }

    const res = await fetch('/api/pengumuman', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push(redirectPath);
    } else {
      alert('Gagal tambah pengumuman');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-white flex items-center justify-center px-4 py-12">
      <div className="bg-white/90 backdrop-blur-md p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-3xl border border-blue-200">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-800 text-center mb-8">
          Tambah Pengumuman {role.toUpperCase()}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Judul</label>
            <input
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Masukkan judul pengumuman"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Subjek</label>
            <input
              type="text"
              value={subjek}
              onChange={(e) => setSubjek(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Masukkan subjek pengumuman"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Isi</label>
            <textarea
              value={isi}
              onChange={(e) => setIsi(e.target.value)}
              rows={5}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
              placeholder="Masukkan isi pengumuman"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Tanggal</label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg transition active:scale-95"
            >
              Tambah
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
