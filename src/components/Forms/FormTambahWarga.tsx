'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BackButton from '../Buttons/BackButton';

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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'status_perkawinan' && value === 'belum_kawin') {
      setForm(prev => ({ ...prev, status_perkawinan: value, tanggal_perkawinan: '' }));
      return;
    }

    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFetchKkData = async (noKkValue: string) => {
    if (!noKkValue) return;

    try {
      const res = await fetch(`/api/kk/${noKkValue}`);
      if (!res.ok) {
        console.warn('KK tidak ditemukan atau error');
        return;
      }

      const data = await res.json();

      const kepalaKeluarga = data.find((item: any) => item.status_hubungan_dalam_keluarga === 'Kepala Keluarga');
      const istri = data.find((item: any) => item.status_hubungan_dalam_keluarga === 'Istri');

      setForm(prev => ({
        ...prev,
        ayah: kepalaKeluarga?.nama || '',
        ibu: istri?.nama || '',
      }));

    } catch (error) {
      console.error('Error fetch KK:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!['laki_laki', 'perempuan'].includes(form.jenis_kelamin)) {
      alert('Pilih jenis kelamin yang valid.');
      setIsSubmitting(false);
      return;
    }

    if (!['belum_kawin', 'kawin_tercatat', 'cerai_hidup', 'cerai_mati'].includes(form.status_perkawinan)) {
      alert('Pilih status perkawinan yang valid.');
      setIsSubmitting(false);
      return;
    }

    if (form.status_perkawinan !== 'belum_kawin' && !form.tanggal_perkawinan) {
      alert('Tanggal perkawinan wajib diisi jika status perkawinan bukan Belum Kawin.');
      setIsSubmitting(false);
      return;
    }

    if (form.status_hubungan_dalam_keluarga === 'Kepala Keluarga') {
      if (!form.rt_id || !form.kategori_id) {
        alert('RT dan Kategori wajib diisi untuk Kepala Keluarga.');
        setIsSubmitting(false);
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
        setIsSubmitting(false);
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

      if (form.status_hubungan_dalam_keluarga === 'Kepala Keluarga') {
        await fetch('/api/user/tambah-dari-nik', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nik: form.nik,
            nama: form.nama,
          }),
        });
      }

      router.push('/dashboard/rw/warga');
    } catch (error) {
      console.error('Client error:', error);
      alert('Terjadi kesalahan di sisi client.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle =
    'mt-1 block w-full rounded-lg border border-gray-300 p-1.5 text-sm text-gray-800 bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500';

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-4xl mx-auto bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Tambah Warga</h2>
        <BackButton />
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            ['No KK', 'no_kk', 'text', false],
            ['Nama', 'nama', 'text', true],
            ['NIK', 'nik', 'text', true],
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
                onBlur={name === 'no_kk' ? (e) => handleFetchKkData(e.target.value) : undefined}
                className={inputStyle}
                required={required}
                disabled={isSubmitting}
              />
            </div>
          ))}

          <Select
            label="Jenis Kelamin"
            name="jenis_kelamin"
            value={form.jenis_kelamin}
            onChange={handleChange}
            options={[
              ['', 'Pilih'],
              ['laki_laki', 'Laki-laki'],
              ['perempuan', 'Perempuan'],
            ]}
          />

          <Select
            label="Status Hubungan"
            name="status_hubungan_dalam_keluarga"
            value={form.status_hubungan_dalam_keluarga}
            onChange={handleChange}
            options={[
              ['', 'Pilih'],
              ['Kepala Keluarga', 'Kepala Keluarga'],
              ['Istri', 'Istri'],
              ['Anak', 'Anak'],
            ]}
          />

          {form.status_hubungan_dalam_keluarga === 'Kepala Keluarga' && (
            <>
              <Select
                label="RT"
                name="rt_id"
                value={form.rt_id}
                onChange={handleChange}
                options={[
                  ['', 'Pilih RT'],
                  ['1', 'RT01'],
                  ['2', 'RT02'],
                  ['3', 'RT03'],
                  ['4', 'RT04'],
                ]}
              />
              <Select
                label="Kategori"
                name="kategori_id"
                value={form.kategori_id}
                onChange={handleChange}
                options={[
                  ['', 'Pilih Kategori'],
                  ['1', 'Kampung'],
                  ['2', 'Kost'],
                  ['3', 'Kavling'],
                  ['4', 'UMKM'],
                  ['5', 'Kantor'],
                  ['6', 'Bisnis'],
                ]}
              />
            </>
          )}

          <Select
            label="Golongan Darah"
            name="golongan_darah"
            value={form.golongan_darah}
            onChange={handleChange}
            options={[
              ['', 'Pilih'],
              ['O', 'O'],
              ['A', 'A'],
              ['B', 'B'],
              ['AB', 'AB'],
            ]}
          />

          <Select
            label="Kewarganegaraan"
            name="kewarganegaraan"
            value={form.kewarganegaraan}
            onChange={handleChange}
            options={[
              ['', 'Pilih'],
              ['WNI', 'WNI'],
              ['WNA', 'WNA'],
            ]}
          />

          <Select
            label="Status Perkawinan"
            name="status_perkawinan"
            value={form.status_perkawinan}
            onChange={handleChange}
            options={[
              ['', 'Pilih'],
              ['belum_kawin', 'Belum Kawin'],
              ['kawin_tercatat', 'Kawin Tercatat'],
              ['cerai_hidup', 'Cerai Hidup'],
              ['cerai_mati', 'Cerai Mati'],
            ]}
          />

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
                disabled={isSubmitting}
                title="Tanggal Pernikahan"
              />
            </div>
          )}

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-semibold shadow ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Data Warga'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Select({
  label,
  name,
  value,
  onChange,
  options,
}: {
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
        title={label}
        className="mt-1 block w-full rounded-lg border border-gray-300 bg-white p-1.5 text-sm text-gray-800 shadow-sm focus:ring-blue-500 focus:border-blue-500"
      >
        {options.map(([val, label]) => (
          <option key={val} value={val}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}