'use client';

import { useState, useEffect } from 'react';

interface Kategori {
  id: number;
  nama: string;
}

interface FormIuranData {
  nama: string;
  deskripsi: string;
  nominal: string;
  tanggal_nagih: string;
  tanggal_tempo: string;
  kategori_id: number | null;
}

export default function FormIuranRW() {
  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  const [formData, setFormData] = useState<FormIuranData>({
    nama: '',
    deskripsi: '',
    nominal: '',
    tanggal_nagih: '',
    tanggal_tempo: '',
    kategori_id: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/kategori')
      .then((res) => res.json())
      .then((data) => setKategoriList(data))
      .catch(() => setKategoriList([]));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
  
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'kategori_id' ? parseInt(value) : value,
    }));
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.kategori_id) {
      setMessage('Kategori wajib dipilih');
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/iuran/bulanan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) {
        setMessage(result.error || 'Gagal membuat iuran');
      } else {
        setMessage('Iuran berhasil dibuat');
        setFormData({
          nama: '',
          deskripsi: '',
          nominal: '',
          tanggal_nagih: '',
          tanggal_tempo: '',
          kategori_id: null,
        });
      }
    } catch (error) {
      console.error(error);
      setMessage('Terjadi kesalahan saat membuat iuran');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-5 text-black">Buat Iuran Bulanan Baru (RW)</h2>

      {message && (
        <div
          className={`mb-5 px-4 py-3 rounded ${
            message.includes('berhasil')
              ? 'bg-green-100 text-green-900 border border-green-300'
              : 'bg-red-100 text-red-900 border border-red-300'
          }`}
          role="alert"
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="nama" className="block font-semibold mb-2 text-black">
            Nama Iuran
          </label>
          <input
            type="text"
            id="nama"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label htmlFor="deskripsi" className="block font-semibold mb-2 text-black">
            Deskripsi
          </label>
          <textarea
            id="deskripsi"
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-black resize-y focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label htmlFor="nominal" className="block font-semibold mb-2 text-black">
            Nominal (Rp)
          </label>
          <input
            type="number"
            id="nominal"
            name="nominal"
            value={formData.nominal}
            onChange={handleChange}
            min={0}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label htmlFor="tanggal_nagih" className="block font-semibold mb-2 text-black">
            Tanggal Tagihan
          </label>
          <input
            type="date"
            id="tanggal_nagih"
            name="tanggal_nagih"
            value={formData.tanggal_nagih}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label htmlFor="tanggal_tempo" className="block font-semibold mb-2 text-black">
            Tanggal Tempo
          </label>
          <input
            type="date"
            id="tanggal_tempo"
            name="tanggal_tempo"
            value={formData.tanggal_tempo}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label htmlFor="kategori_id" className="block font-semibold mb-2 text-black">
            Kategori
          </label>
          <select
            id="kategori_id"
            name="kategori_id"
            value={formData.kategori_id ?? ''}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="" disabled>
              -- Pilih Kategori --
            </option>

            {/* Semua warga sebagai opsi paling atas */}
            {kategoriList
              .filter((kat) => kat.nama.toLowerCase().includes('semua warga'))
              .map((kat) => (
                <option key={kat.id} value={kat.id}>
                  {kat.nama} (Semua)
                </option>
              ))}

            {/* Tampilkan kategori warga yang lain (6 kategori biasa) */}
            {kategoriList
              .filter((kat) => !kat.nama.toLowerCase().includes('semua warga'))
              .map((kat) => (
                <option key={kat.id} value={kat.id}>
                  {kat.nama}
                </option>
              ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50"
        >
          {loading ? 'Menyimpan...' : 'Buat Iuran'}
        </button>
      </form>
    </div>
  );
}