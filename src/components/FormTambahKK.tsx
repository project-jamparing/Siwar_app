'use client';

import { useState } from 'react';

export default function FormTambahKK() {
  const [form, setForm] = useState({
    no_kk: '',
    rt_id: '',
    kategori_id: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/kk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const result = await res.json();
    setLoading(false);
    if (res.ok) {
      alert('✅ Berhasil tambah KK');
      setForm({ no_kk: '', rt_id: '', kategori_id: '' });
    } else {
      alert(result.message || '❌ Gagal menambahkan KK');
    }
  };

  // Data untuk select
  const rtOptions = [
    { id: '1', label: 'RT01' },
    { id: '2', label: 'RT02' },
    { id: '3', label: 'RT03' },
  ];

  const kategoriOptions = [
    { id: '1', label: 'Kampung' },
    { id: '2', label: 'Kost' },
    { id: '3', label: 'Kavling' },
    { id: '4', label: 'UMKM' },
    { id: '5', label: 'Kantor' },
    { id: '6', label: 'Bisnis' },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-md space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-800 text-center">Tambah Kartu Keluarga</h2>

      {/* No KK input */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">No KK</label>
        <input
          type="text"
          name="no_kk"
          value={form.no_kk}
          onChange={handleChange}
          placeholder="Masukkan No KK"
          required
          className="w-full px-4 py-2 border rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
      </div>

      {/* RT select */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">RT</label>
        <select
          name="rt_id"
          value={form.rt_id}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        >
          <option value="" disabled>
            Pilih RT
          </option>
          {rtOptions.map(({ id, label }) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Kategori select */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">Kategori</label>
        <select
          name="kategori_id"
          value={form.kategori_id}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        >
          <option value="" disabled>
            Pilih Kategori
          </option>
          {kategoriOptions.map(({ id, label }) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-medium"
      >
        {loading ? 'Menyimpan...' : 'Tambah KK'}
      </button>
    </form>
  );
}