'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditPengumumanRW() {
  const router = useRouter();
  const { id } = useParams();
  const [judul, setJudul] = useState('');
  const [subjek, setSubjek] = useState('');
  const [isi, setIsi] = useState('');
  const [tanggal, setTanggal] = useState('');

  useEffect(() => {
    const fetchPengumuman = async () => {
      try {
        const res = await fetch(/api/pengumuman/${id});
        const data = await res.json();
        setJudul(data.judul || '');
        setSubjek(data.subjek || '');
        setIsi(data.isi || '');
        setTanggal(data.tanggal?.split('T')[0] || '');
      } catch (err) {
        console.error('Gagal ambil data pengumuman:', err);
      }
    };
    fetchPengumuman();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(/api/pengumuman/${id}, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        judul,
        isi,
        tanggal,
        subjek,
        rt_id: 0, // tetap RW
      }),
    });

    if (res.ok) {
      router.push('/dashboard/rw/pengumuman');
    } else {
      alert('Gagal mengubah pengumuman');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white border border-gray-200 rounded-xl shadow space-y-6"
    >
      <h1 className="text-2xl font-bold text-gray-800">Edit Pengumuman RW</h1>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
        <input
          type="text"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 text-gray-700 rounded-lg"
          placeholder="Judul pengumuman"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Subjek</label>
        <input
          type="text"
          value={subjek}
          onChange={(e) => setSubjek(e.target.value)}
          className="w-full p-3 border border-gray-300 text-gray-700 rounded-lg"
          placeholder="Subjek (opsional)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Isi</label>
        <textarea
          value={isi}
          onChange={(e) => setIsi(e.target.value)}
          required
          rows={5}
          className="w-full p-3 border border-gray-300 text-gray-700 rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
        <input
          type="date"
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 text-gray-700 rounded-lg"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 rounded-lg"
      >
        Simpan Perubahan
      </button>
    </form>
  );
}

