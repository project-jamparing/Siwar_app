'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FormTambahWarga() {
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
    rt_id: '',
    kategori: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Jika status_perkawinan berubah ke "belum_kawin", kosongkan tanggal_perkawinan
    if (name === 'status_perkawinan' && value === 'belum_kawin') {
      setForm(prev => ({ ...prev, status_perkawinan: value, tanggal_perkawinan: '' }));
      return;
    }

    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi jenis kelamin
    if (!['laki_laki', 'perempuan'].includes(form.jenis_kelamin)) {
      alert('Pilih jenis kelamin yang valid.');
      return;
    }

    // Validasi status perkawinan
    if (!['belum_kawin', 'kawin_tercatat', 'cerai_hidup', 'cerai_mati'].includes(form.status_perkawinan)) {
      alert('Pilih status perkawinan yang valid.');
      return;
    }

    // Jika status perkawinan bukan 'belum_kawin', tanggal_perkawinan wajib diisi
    if (form.status_perkawinan !== 'belum_kawin' && !form.tanggal_perkawinan) {
      alert('Tanggal perkawinan wajib diisi jika status perkawinan bukan Belum Kawin.');
      return;
    }

    // Jika status hubungan dalam keluarga Kepala Keluarga, rt_id dan kategori wajib
    if (form.status_hubungan_dalam_keluarga === 'Kepala Keluarga') {
      if (!form.rt_id) {
        alert('RT wajib diisi untuk Kepala Keluarga.');
        return;
      }
      if (!form.kategori_id) {
        alert('Kategori wajib diisi untuk Kepala Keluarga.');
        return;
      }
    }

    try {
      const res = await fetch('/api/warga', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(`Gagal menambahkan warga: ${err.message || res.statusText}`);
        return;
      }

      // Jika Kepala Keluarga, update no_kk dengan nik
      if (form.status_hubungan_dalam_keluarga === 'Kepala Keluarga') {
        await fetch('/api/kk/update-nik', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            no_kk: form.no_kk,
            nik: form.nik,
          }),
        });
      }

      router.push('/dashboard/rw/warga');
    } catch (error) {
      console.error('Client error:', error);
      alert('Terjadi kesalahan di sisi client.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
      {/* Input text dan tanggal */}
      {[
        ['NIK', 'nik', 'text', true],
        ['Nama', 'nama', 'text', true],
        ['No KK', 'no_kk', 'text', false],
        ['Tempat Lahir', 'tempat_lahir', 'text', false],
        ['Tanggal Lahir', 'tanggal_lahir', 'date', false],
        ['Agama', 'agama', 'text', false],
        ['Pendidikan', 'pendidikan', 'text', false],
        ['Pekerjaan', 'jenis_pekerjaan', 'text', false],
        ['No Paspor', 'no_paspor', 'text', false],
        ['No KITAP', 'no_kitap', 'text', false],
        ['Ayah', 'ayah', 'text', false],
        ['Ibu', 'ibu', 'text', false],
      ].map(([label, name, type, required]) => (
        <div key={name}>
          <label className="block text-sm font-medium text-gray-700">{label}</label>
          <input
            type={type}
            name={name}
            value={(form as any)[name] || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded border border-gray-300 p-2 text-sm"
            required={required}
          />
        </div>
      ))}

      {/* Jenis Kelamin */}
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

      {/* Status Hubungan */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Status Hubungan</label>
        <select
          name="status_hubungan_dalam_keluarga"
          value={form.status_hubungan_dalam_keluarga}
          onChange={handleChange}
          className="mt-1 block w-full rounded border border-gray-300 p-2 text-sm"
          required
        >
          <option value="">Pilih</option>
          <option value="Kepala Keluarga">Kepala Keluarga</option>
          <option value="Istri">Istri</option>
          <option value="Anak">Anak</option>
        </select>
      </div>

      {/* Jika Kepala Keluarga, tampilkan RT dan Kategori */}
      {form.status_hubungan_dalam_keluarga === 'Kepala Keluarga' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">RT</label>
            <select
              name="rt_id"
              value={form.rt_id}
              onChange={handleChange}
              className="mt-1 block w-full rounded border border-gray-300 p-2 text-sm"
              required
            >
              <option value="">Pilih RT</option>
              <option value="1">RT01</option>
              <option value="2">RT02</option>
              <option value="3">RT03</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Kategori</label>
            <select
              name="kategori_id"
              value={form.kategori_id}
              onChange={handleChange}
              className="mt-1 block w-full rounded border border-gray-300 p-2 text-sm"
              required
            >
              <option value="">Pilih Kategori</option>
              <option value="1">Kampung</option>
              <option value="2">Kost</option>
              <option value="3">Kavling</option>
              <option value="4">UMKM</option>
              <option value="5">Kantor</option>
              <option value="6">Bisnis</option>
            </select>
          </div>
        </>
      )}

      {/* Golongan Darah */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Golongan Darah</label>
        <select
          name="golongan_darah"
          value={form.golongan_darah}
          onChange={handleChange}
          className="mt-1 block w-full rounded border border-gray-300 p-2 text-sm"
          required
        >
          <option value="">Pilih</option>
          <option value="O">O</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="AB">AB</option>
        </select>
      </div>

      {/* Kewarganegaraan */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Kewarganegaraan</label>
        <select
          name="kewarganegaraan"
          value={form.kewarganegaraan}
          onChange={handleChange}
          className="mt-1 block w-full rounded border border-gray-300 p-2 text-sm"
          required
        >
          <option value="">Pilih</option>
          <option value="WNI">WNI</option>
          <option value="WNA">WNA</option>
        </select>
      </div>

      {/* Status Perkawinan */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Status Perkawinan</label>
        <select
          name="status_perkawinan"
          value={form.status_perkawinan}
          onChange={handleChange}
          className="mt-1 block w-full rounded border border-gray-300 p-2 text-sm"
          required
        >
          <option value="">Pilih</option>
          <option value="belum_kawin">Belum Kawin</option>
          <option value="kawin_tercatat">Kawin Tercatat</option>
          <option value="cerai_hidup">Cerai Hidup</option>
          <option value="cerai_mati">Cerai Mati</option>
        </select>
      </div>

      {/* Tanggal Perkawinan - tampil hanya jika status_perkawinan bukan belum_kawin */}
      {form.status_perkawinan !== 'belum_kawin' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Tanggal Perkawinan</label>
          <input
            type="date"
            name="tanggal_perkawinan"
            value={form.tanggal_perkawinan}
            onChange={handleChange}
            className="mt-1 block w-full rounded border border-gray-300 p-2 text-sm"
            required={form.status_perkawinan !== 'belum_kawin'}
          />
        </div>
      )}

      <button
        type="submit"
        className="col-span-1 md:col-span-2 mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Simpan Data
      </button>
    </form>
  );
}