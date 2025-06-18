'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditPengumumanPage() {
  const { id } = useParams();
  const router = useRouter();

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
      setTanggal(data.tanggal.slice(0, 10));
    }

    fetchData();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch(`/api/pengumuman/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ judul, subjek, isi, tanggal }),
    });

    if (res.ok) {
      router.push('/dashboard/rt/pengumuman');
    } else {
      alert('Gagal update pengumuman');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold text-gray-900 mb-4">Edit Pengumuman</h1>
      <input
        type="text"
        value={judul}
        onChange={(e) => setJudul(e.target.value)}
        placeholder="Judul"
        className="border p-2 w-full text-gray-700"
      />
      <input
        type="text"
        value={subjek ?? ''}
        onChange={(e) => setSubjek(e.target.value)}
        placeholder="Subjek"
        className="border p-2 w-full text-gray-700"
      />
      <textarea
        value={isi}
        onChange={(e) => setIsi(e.target.value)}
        placeholder="Isi"
        className="border p-2 w-full h-32 text-gray-700"
      />
      <input
        type="date"
        value={tanggal}
        onChange={(e) => setTanggal(e.target.value)}
        className="border p-2 w-full text-gray-700"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Simpan
      </button>
    </form>
  );
}
