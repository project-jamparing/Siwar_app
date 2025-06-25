// Path: src/components/Forms/FormIuranRW.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import BackButton from '../Buttons/BackButton' // Pastikan path ini benar

export default function FormIuran() {
  const router = useRouter()

  const [form, setForm] = useState({
    nama: '',
    deskripsi: '',
    nominal: '',
    tanggal_nagih: '',
    tanggal_tempo: '',
    kategori_id: '',
  })

  // Anda bisa mengganti ini dengan data kategori yang di-fetch dari API jika ada
  const kategoriOptions = [
    { id: 1, label: 'Kampung' },
    { id: 2, label: 'Kost' },
    { id: 3, label: 'Kavling' },
    { id: 4, label: 'UMKM' },
    { id: 5, label: 'Kantor' },
    { id: 6, label: 'Bisnis' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Axios akan melempar error secara otomatis jika status HTTP bukan 2xx (misal 4xx, 5xx)
      // Jadi, jika kode sampai sini, berarti respons dari API adalah 2xx (sukses).
      await axios.post('/api/iuran/bulanan', { // Tidak perlu menyimpan response jika tidak digunakan
        ...form,
        nominal: parseFloat(form.nominal),
        kategori_id: parseInt(form.kategori_id),
      })

      // Jika berhasil (tidak masuk catch block), LANGSUNG redirect
      // alert(response.data.message || 'Iuran dan tagihan berhasil dibuat!'); // BARIS INI DIHAPUS
      router.push('/dashboard/rw/iuran');

    } catch (error: any) {
      console.error('Gagal menambahkan iuran:', error)
      if (axios.isAxiosError(error) && error.response) {
        // Tampilkan pesan error spesifik dari backend jika ada
        alert(`Gagal menambahkan iuran: ${error.response.data.message || error.response.statusText}`);
        // Log respons error dari API untuk debugging lebih lanjut
        console.error('API Error Response:', error.response.data); 
      } else {
        // Tampilkan pesan error umum jika bukan error Axios atau tidak ada respons
        alert('Terjadi kesalahan tidak terduga saat menambahkan iuran. Silakan coba lagi.');
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-xl shadow-lg p-6 sm:p-8 transform transition-all hover:scale-[1.005] duration-300 ease-in-out">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800 tracking-tight">
          Tambah Data Iuran RW
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <BackButton /> {/* Tombol kembali, pastikan sudah diimpor */}

          {/* Nama Iuran */}
          <div>
            <label htmlFor="nama" className="block mb-2 text-sm font-semibold text-gray-700">Nama Iuran</label>
            <input
              type="text"
              id="nama"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
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
              value={form.deskripsi}
              onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
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
                inputMode="numeric"
                value={form.nominal ? Number(form.nominal).toLocaleString('id-ID') : ''}
                onChange={(e) => {
                  const value = e.target.value.replace(/\./g, '').replace(/[^0-9]/g, '')
                  setForm({ ...form, nominal: value })
                }}
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
                value={form.tanggal_nagih}
                onChange={(e) => setForm({ ...form, tanggal_nagih: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 bg-gray-50 text-base text-gray-800 focus:outline-none focus:ring-3 focus:ring-blue-400 focus:border-blue-400 transition duration-200 ease-in-out shadow-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="tanggal_tempo" className="block mb-2 text-sm font-semibold text-gray-700">Tanggal Tempo</label>
              <input
                type="date"
                id="tanggal_tempo"
                value={form.tanggal_tempo}
                onChange={(e) => setForm({ ...form, tanggal_tempo: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 bg-gray-50 text-base text-gray-800 focus:outline-none focus:ring-3 focus:ring-blue-400 focus:border-blue-400 transition duration-200 ease-in-out shadow-sm"
                required
              />
            </div>
          </div>

          {/* Kategori */}
          <div>
            <label htmlFor="kategori_id" className="block mb-2 text-sm font-semibold text-gray-700">Kategori</label>
            <div className="relative"> {/* Tambahkan relative untuk menempatkan ikon arrow */}
              <select
                id="kategori_id"
                value={form.kategori_id}
                onChange={(e) => setForm({ ...form, kategori_id: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 bg-gray-50 text-base text-gray-800 focus:outline-none focus:ring-3 focus:ring-blue-400 focus:border-blue-400 transition duration-200 ease-in-out shadow-sm appearance-none" // appearance-none untuk custom arrow
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
            Simpan Iuran
          </button>
        </form>
      </div>
    </div>
  )
}
