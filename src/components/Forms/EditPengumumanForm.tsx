'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import BackButton from '../Buttons/BackButton';

type EditPengumumanFormProps = {
  role: 'rw' | 'rt';
  redirectPath: string;
  titleColor: string;
  ringColor: string;
  buttonLabel: string;
};

export default function EditPengumumanForm({
  role,
  redirectPath,
  titleColor,
  ringColor,
  buttonLabel,
}: EditPengumumanFormProps) {
  const router = useRouter();
  const { id } = useParams();

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
      setTanggal(data.tanggal?.slice(0, 10) || '');
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

      if (res.ok) {
        router.push(redirectPath);
      } else {
        throw new Error('Gagal update pengumuman');
      }
    } catch (err) {
      console.error(err);
      alert('Gagal update pengumuman');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-indigo-100 to-white flex items-center justify-center px-4 py-10">
      <div className="bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-2xl">
        <h1 className={`text-2xl sm:text-3xl font-bold text-center mb-6 ${titleColor}`}>
          Edit Pengumuman {role.toUpperCase()}
        </h1>
        <BackButton />

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Judul</label>
            <input
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              required
              className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 ${ringColor} text-gray-800`}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Subjek</label>
            <input
              type="text"
              value={subjek}
              onChange={(e) => setSubjek(e.target.value)}
              className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 ${ringColor} text-gray-800`}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Isi</label>
            <textarea
              value={isi}
              onChange={(e) => setIsi(e.target.value)}
              rows={5}
              className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 ${ringColor} text-gray-800`}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Tanggal</label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              required
              className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 ${ringColor} text-gray-800`}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200"
            >
              {buttonLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}