'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import BackButton from '../Buttons/BackButton';

export default function FormIuran() {
  const router = useRouter();

  const [form, setForm] = useState({
    nama: '',
    deskripsi: '',
    nominal: '',
    tanggal_nagih: '',
    tanggal_tempo: '',
    kategori_id: '',
  });

  const kategoriOptions = [
    { id: 1, label: 'Kampung' },
    { id: 2, label: 'Kost' },
    { id: 3, label: 'Kavling' },
    { id: 4, label: 'UMKM' },
    { id: 5, label: 'Kantor' },
    { id: 6, label: 'Bisnis' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post('/api/iuran/bulanan', {
        ...form,
        nominal: parseFloat(form.nominal),
        kategori_id: parseInt(form.kategori_id),
      });

      router.push('/dashboard/rw/iuran'); // langsung redirect ke halaman utama
    } catch (error) {
      alert('Gagal menambahkan iuran.');
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 border border-gray-300 rounded-lg shadow-sm bg-white max-w-lg mx-auto text-gray-700"
    >
      <h2 className="text-xl font-bold mb-4 text-center">Tambah Data Iuran</h2>

      <div>
        <BackButton />
        <label className="block text-sm font-medium mb-1">Nama Iuran</label>
        <input
          type="text"
          value={form.nama}
          onChange={(e) => setForm({ ...form, nama: e.target.value })}
          className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Deskripsi</label>
        <input
          type="text"
          value={form.deskripsi}
          onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
          className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Nominal</label>
        <input
          type="text"
          inputMode="numeric"
          value={form.nominal ? Number(form.nominal).toLocaleString('id-ID') : ''}
          onChange={(e) => {
            const value = e.target.value.replace(/\./g, '').replace(/[^0-9]/g, '');
            setForm({ ...form, nominal: value });
          }}
          className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tanggal Nagih</label>
        <input
          type="date"
          value={form.tanggal_nagih}
          onChange={(e) => setForm({ ...form, tanggal_nagih: e.target.value })}
          className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tanggal Tempo</label>
        <input
          type="date"
          value={form.tanggal_tempo}
          onChange={(e) => setForm({ ...form, tanggal_tempo: e.target.value })}
          className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Kategori</label>
        <select
          value={form.kategori_id}
          onChange={(e) => setForm({ ...form, kategori_id: e.target.value })}
          className="border border-gray-300 rounded px-3 py-2 w-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        >
          <option value="" disabled>
            Pilih kategori...
          </option>
          {kategoriOptions.map((kategori) => (
            <option key={kategori.id} value={kategori.id}>
              {kategori.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white font-semibold px-6 py-2 rounded hover:bg-blue-600 transition"
      >
        Simpan
      </button>
    </form>
  );
}
