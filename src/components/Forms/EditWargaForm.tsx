'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import BackButton from '../Buttons/BackButton';

export default function EditWargaPage() {
  const router = useRouter();
  const { nik } = useParams();
  const [showSuccess, setShowSuccess] = useState(false);

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

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/warga/${nik}`);
      const data = await res.json();
      setForm(data);
    };
    if (nik) fetchData();
  }, [nik]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/warga/${nik}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        alert('Gagal update: ' + err.message);
        return;
      }

      setShowSuccess(true);
    } catch (error) {
      console.error('Client error:', error);
      alert('Terjadi kesalahan di sisi client.');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto text-black">
      <h1 className="text-2xl font-bold mb-4">Edit Data Warga</h1>
      <BackButton />
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Field input umum */}
        {[
          ['NIK', 'nik'],
          ['Nama', 'nama'],
          ['No KK', 'no_kk'],
          ['Tempat Lahir', 'tempat_lahir'],
          ['Tanggal Lahir', 'tanggal_lahir'],
          ['Agama', 'agama'],
          ['Pendidikan', 'pendidikan'],
          ['Pekerjaan', 'jenis_pekerjaan'],
          ['No Paspor', 'no_paspor'],
          ['No KITAP', 'no_kitap'],
          ['Ayah', 'ayah'],
          ['Ibu', 'ibu'],
        ].map(([label, name]) => (
          <div key={name}>
            <label className="block text-sm font-semibold text-gray-800 mb-1">{label}</label>
            <input
              type={name.includes('tanggal') ? 'date' : 'text'}
              name={name}
              value={(form as any)[name] || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required={['nik', 'nama'].includes(name)}
            />
          </div>
        ))}

        {/* Jenis Kelamin */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">Jenis Kelamin</label>
          <select
            name="jenis_kelamin"
            value={form.jenis_kelamin}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            required
          >
            <option value="">Pilih</option>
            <option value="laki_laki">Laki-laki</option>
            <option value="perempuan">Perempuan</option>
          </select>
        </div>

        {/* Status Hubungan */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">Status Hubungan dalam Keluarga</label>
          <select
            name="status_hubungan_dalam_keluarga"
            value={form.status_hubungan_dalam_keluarga}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            required
          >
            <option value="">Pilih</option>
            <option value="Kepala Keluarga">Kepala Keluarga</option>
            <option value="Istri">Istri</option>
            <option value="Anak">Anak</option>
          </select>
        </div>

        {/* Golongan Darah */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">Golongan Darah</label>
          <select
            name="golongan_darah"
            value={form.golongan_darah}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            required
          >
            <option value="undefined">Pilih</option>
            <option value="O">O</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="AB">AB</option>
          </select>
        </div>

        {/* Kewarganegaraan */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">Kewarganegaraan</label>
          <select
            name="kewarganegaraan"
            value={form.kewarganegaraan}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            required
          >
            <option value="">Pilih</option>
            <option value="WNI">WNI</option>
            <option value="WNA">WNA</option>
          </select>
        </div>

        {/* Status Perkawinan */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">Status Perkawinan</label>
          <select
            name="status_perkawinan"
            value={form.status_perkawinan}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">Pilih</option>
            <option value="belum_kawin">Belum Kawin</option>
            <option value="kawin_tercatat">Kawin Tercatat</option>
            <option value="cerai_hidup">Cerai Hidup</option>
            <option value="cerai_mati">Cerai Mati</option>
          </select>
        </div>

        {/* Tambahan jika Kepala Keluarga */}
        {form.status_hubungan_dalam_keluarga === 'Kepala Keluarga' && (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">RT</label>
              <input
                type="text"
                name="rt_id"
                value={form.rt_id || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Kategori</label>
              <select
                name="kategori"
                value={form.kategori || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">Pilih</option>
                <option value="Mampu">Mampu</option>
                <option value="Tidak Mampu">Tidak Mampu</option>
              </select>
            </div>

         {/* Tanggal Perkawinan (muncul jika sudah kawin) */}
          {form.status_perkawinan !== 'belum_kawin' && (
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Tanggal Kawin</label>
              <input
                type="date"
                name="tanggal_perkawinan"
                value={form.tanggal_perkawinan || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
        )}
          </>
        )}

        <button
          type="submit"
          className="col-span-1 md:col-span-2 mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          Simpan Perubahan
        </button>
      </form>

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md text-center">
            <h2 className="text-lg font-semibold mb-2">Perubahan Berhasil</h2>
            <p className="text-sm text-gray-600 mb-4">Data warga berhasil diperbarui.</p>
            <button
              onClick={() => {
                setShowSuccess(false);
                router.push('/dashboard/rw/warga');
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}