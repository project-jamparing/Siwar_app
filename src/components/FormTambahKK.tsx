'use client';

import { useState } from 'react';

export default function FormTambahKK() {
  const [form, setForm] = useState({
    no_kk: '',
    rt_id: '',
    nik: '',
    kategori_id: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setForm({ no_kk: '', rt_id: '', nik: '', kategori_id: '' });
    } else {
      alert(result.message || '❌ Gagal menambahkan KK');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-md space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-800 text-center">Tambah Kartu Keluarga</h2>

      {[
        { label: 'No KK', name: 'no_kk', placeholder: 'Masukkan No KK' },
        { label: 'RT ID', name: 'rt_id', placeholder: 'Masukkan ID RT' },
        { label: 'NIK Kepala Keluarga (Opsional)', name: 'nik', placeholder: 'Boleh dikosongkan' },
        { label: 'Kategori ID', name: 'kategori_id', placeholder: 'Masukkan ID Kategori' },
      ].map(({ label, name, placeholder }) => (
        <div key={name}>
          <label className="block mb-1 font-medium text-gray-700">{label}</label>
          <input
            type="text"
            name={name}
            value={(form as any)[name]}
            onChange={handleChange}
            placeholder={placeholder}
            required={name === 'no_kk'} // hanya no_kk yang wajib diisi
            className="w-full px-4 py-2 border rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>
      ))}

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