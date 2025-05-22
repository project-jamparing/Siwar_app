'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TambahWargaPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nik: '',
    nama: '',
    no_kk: '',
    jenis_kelamin: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    agama: '',
    pendidikan: '',
    jenis_pekerjaan: '',
    golongan_darah: '',
    status_perkawinan: '',
    tanggal_perkawinan: '',
    status_hubungan_dalam_keluarga: '',
    kewarganegaraan: '',
    no_paspor: '',
    no_kitap: '',
    ayah: '',
    ibu: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/warga', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push('/dashboard/admin/warga');
    } else {
      alert('Gagal menambahkan warga');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tambah Warga</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
        {[
          ['NIK', 'nik'],
          ['Nama', 'nama'],
          ['No KK', 'no_kk'],
          ['Tempat Lahir', 'tempat_lahir'],
          ['Tanggal Lahir', 'tanggal_lahir'],
          ['Agama', 'agama'],
          ['Pendidikan', 'pendidikan'],
          ['Pekerjaan', 'jenis_pekerjaan'],
          ['Golongan Darah', 'golongan_darah'],
          ['Status Kawin', 'status_perkawinan'],
          ['Tgl Kawin', 'tanggal_perkawinan'],
          ['Status Hubungan', 'status_hubungan_dalam_keluarga'],
          ['Kewarganegaraan', 'kewarganegaraan'],
          ['No Paspor', 'no_paspor'],
          ['No KITAP', 'no_kitap'],
          ['Ayah', 'ayah'],
          ['Ibu', 'ibu'],
        ].map(([label, name]) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
              type={name.includes('tanggal') ? 'date' : 'text'}
              name={name}
              value={(form as any)[name]}
              onChange={handleChange}
              className="mt-1 block w-full rounded border border-gray-300 p-2 text-sm"
              required={['nik', 'nama'].includes(name)}
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-gray-700">Jenis Kelamin</label>
          <select
            name="jenis_kelamin"
            value={form.jenis_kelamin}
            onChange={handleChange}
            className="mt-1 block w-full rounded border border-gray-300 p-2 text-sm"
            required
          >
            <option value="">Pilih</option>
            <option value="laki_laki">Laki-laki</option>
            <option value="perempuan">Perempuan</option>
          </select>
        </div>

        <button
          type="submit"
          className="col-span-1 md:col-span-2 mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Simpan Data
        </button>
      </form>
    </div>
  );
}