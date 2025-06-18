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
      const data = await res.json();
      setJudul(data.judul);
      setSubjek(data.subjek);
      setIsi(data.isi);
    }
    if (id) fetchData();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch(`/api/pengumuman/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ judul, subjek, isi }),
      });
      if (!res.ok) throw new Error('Gagal update');
      router.push('/dashboard/rw/pengumuman');
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl text-gray-900 font-bold mb-4">Edit Pengumuman</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          className="w-full text-gray-900 border p-2 rounded"
          required
        />
        <input
          type="text"
          value={subjek}
          onChange={(e) => setSubjek(e.target.value)}
          className="w-full text-gray-900 border p-2 rounded"
        />
        <textarea
          value={isi}
          onChange={(e) => setIsi(e.target.value)}
          className="w-full text-gray-900 border p-2 rounded"
          rows={6}
        />
        <input
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            className="border p-2 w-full text-gray-700"
        />
        <button
          type="submit"
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
        >
          Update
        </button>
      </form>
    </div>
  );
}