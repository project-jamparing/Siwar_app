// Path: src/components/Forms/EditIuranFormRW.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import BackButton from '@/components/Buttons/BackButton'; // Pastikan path ini benar

// Definisi interface untuk properti yang akan diterima komponen ini
interface EditIuranFormRWProps {
  iuranId: number; // ID iuran yang akan diedit
}

export default function EditIuranFormRW({ iuranId }: EditIuranFormRWProps) {
  const router = useRouter();
  // Menggunakan 'any' untuk form karena struktur data awal bisa null dan akan diisi dynamic
  const [form, setForm] = useState<any>(null); 
  const [loading, setLoading] = useState(true);

  // Opsi kategori, sesuaikan jika ini di-fetch dari API di aplikasi nyata
  const kategoriOptions = [
    { id: 1, label: 'Semua Warga' },
    { id: 2, label: 'Warga RT 01' },
    { id: 3, label: 'Warga RT 02' },
    // Tambahkan kategori lain sesuai kebutuhan
  ];

  useEffect(() => {
    const fetchIuran = async () => {
      // Pastikan iuranId valid sebelum melakukan fetch
      if (isNaN(iuranId)) {
        console.error("ID Iuran tidak valid:", iuranId);
        setLoading(false);
        return;
      }

      try {
        setLoading(true); // Mulai loading
        const res = await axios.get(`/api/iuran/bulanan/${iuranId}`); // Pastikan endpoint API benar
        const data = res.data;

        // Pastikan format tanggal sesuai untuk input type="date" (YYYY-MM-DD)
        setForm({
          ...data,
          nominal: data.nominal.toString(), // Ubah nominal ke string untuk input
          tanggal_nagih: data.tanggal_nagih ? new Date(data.tanggal_nagih).toISOString().split('T')[0] : '',
          tanggal_tempo: data.tanggal_tempo ? new Date(data.tanggal_tempo).toISOString().split('T')[0] : '',
          kategori_id: data.kategori_id.toString(), // Pastikan kategori_id juga string untuk select
        });
      } catch (error: any) {
        console.error('Gagal mengambil data iuran:', error);
        if (axios.isAxiosError(error) && error.response) {
          alert(`Gagal mengambil data iuran: ${error.response.data.message || error.response.statusText}`);
        } else {
          alert('Terjadi kesalahan tidak dikenal saat mengambil data iuran.');
        }
      } finally {
        setLoading(false); // Selesai loading
      }
    };
    fetchIuran();
  }, [iuranId]); // Dependensi [iuranId] agar fetch ulang jika ID berubah

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'nominal') {
      // Hanya izinkan angka, hapus semua karakter non-digit
      const raw = value.replace(/\D/g, ''); 
      setForm((prevForm: any) => ({ ...prevForm, nominal: raw }));
    } else {
      setForm((prevForm: any) => ({ ...prevForm, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Mengirim PATCH request dengan data yang diperbarui
      await axios.patch(`/api/iuran/bulanan/${iuranId}`, {
        ...form,
        nominal: parseFloat(form.nominal), // Konversi nominal kembali ke float
        kategori_id: parseInt(form.kategori_id), // Konversi kategori_id kembali ke int
      });

      // alert('Iuran berhasil diperbarui!'); // BARIS INI KINI DIHAPUS SESUAI PERMINTAAN
      router.push('/dashboard/rw/iuran'); // Langsung redirect ke halaman daftar iuran
    } catch (error: any) {
      console.error('Gagal update iuran:', error);
      if (axios.isAxiosError(error) && error.response) {
        alert(`Gagal memperbarui iuran: ${error.response.data.message || error.response.statusText}`);
      } else {
        alert('Terjadi kesalahan tidak dikenal saat memperbarui iuran.');
      }
    }
  };

  if (loading || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 font-sans">
        <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Memuat data iuran untuk diedit...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-xl shadow-lg p-6 sm:p-8 transform transition-all duration-300 ease-in-out">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800 tracking-tight">
        Edit Iuran
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <BackButton /> {/* Tombol kembali */}

        {/* Nama Iuran */}
        <div>
          <label htmlFor="nama" className="block mb-2 text-sm font-semibold text-gray-700">Nama Iuran</label>
          <input
            type="text"
            id="nama"
            name="nama"
            value={form.nama || ''}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 bg-gray-50 text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-3 focus:ring-blue-400 focus:border-blue-400 transition duration-200 ease-in-out shadow-sm"
            placeholder="Contoh: Iuran keamanan RW"
            required
          />
        </div>

        {/* Deskripsi */}
        <div>
          <label htmlFor="deskripsi" className="block mb-2 text-sm font-semibold text-gray-700">Deskripsi</label>
          <textarea
            id="deskripsi"
            name="deskripsi"
            value={form.deskripsi || ''}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 bg-gray-50 text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-3 focus:ring-blue-400 focus:border-blue-400 transition duration-200 ease-in-out shadow-sm resize-y"
            placeholder="Penjelasan singkat tentang iuran"
            required
          ></textarea>
        </div>

        {/* Nominal */}
        <div>
          <label htmlFor="nominal" className="block mb-2 text-sm font-semibold text-gray-700">Nominal</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-base font-medium">Rp</span>
            <input
              type="text"
              id="nominal"
              name="nominal"
              inputMode="numeric"
              value={form.nominal ? Number(form.nominal).toLocaleString('id-ID') : ''} // Format untuk tampilan
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-gray-300 bg-gray-50 text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-3 focus:ring-blue-400 focus:border-blue-400 transition duration-200 ease-in-out shadow-sm"
              placeholder="Contoh: 100.000"
              required
            />
          </div>
        </div>

        {/* Tanggal Nagih & Tempo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="tanggal_nagih" className="block mb-2 text-sm font-semibold text-gray-700">Tanggal Nagih</label>
            <input
              type="date"
              id="tanggal_nagih"
              name="tanggal_nagih"
              value={form.tanggal_nagih || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 bg-gray-50 text-base text-gray-800 focus:outline-none focus:ring-3 focus:ring-blue-400 focus:border-blue-400 transition duration-200 ease-in-out shadow-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="tanggal_tempo" className="block mb-2 text-sm font-semibold text-gray-700">Tanggal Tempo</label>
            <input
              type="date"
              id="tanggal_tempo"
              name="tanggal_tempo"
              value={form.tanggal_tempo || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 bg-gray-50 text-base text-gray-800 focus:outline-none focus:ring-3 focus:ring-blue-400 focus:border-blue-400 transition duration-200 ease-in-out shadow-sm"
              required
            />
          </div>
        </div>

        {/* Kategori */}
        <div>
          <label htmlFor="kategori_id" className="block mb-2 text-sm font-semibold text-gray-700">Kategori</label>
          <div className="relative">
            <select
              id="kategori_id"
              name="kategori_id"
              value={form.kategori_id || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 bg-gray-50 text-base text-gray-800 focus:outline-none focus:ring-3 focus:ring-blue-400 focus:border-blue-400 transition duration-200 ease-in-out shadow-sm appearance-none"
              required
            >
              <option value="" disabled>Pilih kategori...</option>
              {kategoriOptions.map((kategori) => (
                <option key={kategori.id} value={kategori.id}>
                  {kategori.label}
                </option>
              ))}
            </select>
            {/* Custom arrow untuk select */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
              <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg transition duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}
