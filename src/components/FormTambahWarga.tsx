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
    kategori_id: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'status_perkawinan' && value === 'belum_kawin') {
      setForm(prev => ({ ...prev, status_perkawinan: value, tanggal_perkawinan: '' }));
      return;
    }

    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!['laki_laki', 'perempuan'].includes(form.jenis_kelamin)) {
      alert('Pilih jenis kelamin yang valid.');
      return;
    }

    if (!['belum_kawin', 'kawin_tercatat', 'cerai_hidup', 'cerai_mati'].includes(form.status_perkawinan)) {
      alert('Pilih status perkawinan yang valid.');
      return;
    }

    if (form.status_perkawinan !== 'belum_kawin' && !form.tanggal_perkawinan) {
      alert('Tanggal perkawinan wajib diisi jika status perkawinan bukan Belum Kawin.');
      return;
    }

    if (form.status_hubungan_dalam_keluarga === 'Kepala Keluarga') {
      if (!form.rt_id || !form.kategori_id) {
        alert('RT dan Kategori wajib diisi untuk Kepala Keluarga.');
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

  const inputStyle =
    'mt-1 block w-full rounded-lg border border-gray-300 p-2 text-sm text-gray-800 bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500';

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Form Tambah Warga</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                className={inputStyle}
                required={required}
              />
            </div>
          ))}

          <Select label="Jenis Kelamin" name="jenis_kelamin" value={form.jenis_kelamin} onChange={handleChange} options={[
            ['', 'Pilih'],
            ['laki_laki', 'Laki-laki'],
            ['perempuan', 'Perempuan'],
          ]} />

          <Select label="Status Hubungan" name="status_hubungan_dalam_keluarga" value={form.status_hubungan_dalam_keluarga} onChange={handleChange} options={[
            ['', 'Pilih'],
            ['Kepala Keluarga', 'Kepala Keluarga'],
            ['Istri', 'Istri'],
            ['Anak', 'Anak'],
          ]} />

          {form.status_hubungan_dalam_keluarga === 'Kepala Keluarga' && (
            <>
              <Select label="RT" name="rt_id" value={form.rt_id} onChange={handleChange} options={[
                ['', 'Pilih RT'],
                ['1', 'RT01'],
                ['2', 'RT02'],
                ['3', 'RT03'],
              ]} />
              <Select label="Kategori" name="kategori_id" value={form.kategori_id} onChange={handleChange} options={[
                ['', 'Pilih Kategori'],
                ['1', 'Kampung'],
                ['2', 'Kost'],
                ['3', 'Kavling'],
                ['4', 'UMKM'],
                ['5', 'Kantor'],
                ['6', 'Bisnis'],
              ]} />
            </>
          )}

          <Select label="Golongan Darah" name="golongan_darah" value={form.golongan_darah} onChange={handleChange} options={[
            ['', 'Pilih'],
            ['O', 'O'],
            ['A', 'A'],
            ['B', 'B'],
            ['AB', 'AB'],
          ]} />

          <Select label="Kewarganegaraan" name="kewarganegaraan" value={form.kewarganegaraan} onChange={handleChange} options={[
            ['', 'Pilih'],
            ['WNI', 'WNI'],
            ['WNA', 'WNA'],
          ]} />

          <Select label="Status Perkawinan" name="status_perkawinan" value={form.status_perkawinan} onChange={handleChange} options={[
            ['', 'Pilih'],
            ['belum_kawin', 'Belum Kawin'],
            ['kawin_tercatat', 'Kawin Tercatat'],
            ['cerai_hidup', 'Cerai Hidup'],
            ['cerai_mati', 'Cerai Mati'],
          ]} />

          {form.status_perkawinan !== 'belum_kawin' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Tanggal Perkawinan</label>
              <input
                type="date"
                name="tanggal_perkawinan"
                value={form.tanggal_perkawinan}
                onChange={handleChange}
                className={inputStyle}
                required
              />
            </div>
          )}

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-semibold shadow"
            >
              Simpan Data Warga
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Select({ label, name, value, onChange, options }: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: [string, string][];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full rounded-lg border border-gray-300 p-2 text-sm text-gray-800 bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500"
        required
      >
        {options.map(([val, labelText]) => (
          <option key={val} value={val}>{labelText}</option>
        ))}
      </select>
    </div>
  );
}