// src/components/Forms/FormIuran.tsx

'use client';

import { useState } from 'react';
import axios from 'axios';

export default function FormIuran() {
  const [form, setForm] = useState({
    nama: '',
    deskripsi: '',
    nominal: '',
    tanggal_nagih: '',
    tanggal_tempo: '',
    kategori_id: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await axios.post('/api/iuran/bulanan', {
      ...form,
      nominal: parseFloat(form.nominal),
      kategori_id: parseInt(form.kategori_id),
    });

    alert('Iuran berhasil ditambahkan!');
    setForm({
      nama: '',
      deskripsi: '',
      nominal: '',
      tanggal_nagih: '',
      tanggal_tempo: '',
      kategori_id: '',
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 border border-gray-300 rounded-lg shadow-sm bg-white max-w-lg mx-auto text-gray-700"
    >
      <h2 className="text-xl font-bold mb-4 text-center">Tambah Iuran</h2>

      <div>
        <label className="block text-sm font-medium mb-1">Nama:</label>
        <input
          type="text"
          value={form.nama}
          onChange={(e) => setForm({ ...form, nama: e.target.value })}
          className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Deskripsi:</label>
        <input
          type="text"
          value={form.deskripsi}
          onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
          className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Nominal:</label>
        <input
          type="number"
          value={form.nominal}
          onChange={(e) => setForm({ ...form, nominal: e.target.value })}
          className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tanggal Nagih:</label>
        <input
          type="date"
          value={form.tanggal_nagih}
          onChange={(e) => setForm({ ...form, tanggal_nagih: e.target.value })}
          className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tanggal Tempo:</label>
        <input
          type="date"
          value={form.tanggal_tempo}
          onChange={(e) => setForm({ ...form, tanggal_tempo: e.target.value })}
          className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Kategori ID:</label>
        <input
          type="number"
          value={form.kategori_id}
          onChange={(e) => setForm({ ...form, kategori_id: e.target.value })}
          className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
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
