// Path: src/components/Forms/FormTambahIuranSekali.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import BackButton from '../Buttons/BackButton' // Pastikan path ini benar

interface Kategori {
  id: number
  nama: string
}

export default function FormTambahIuranSekali() {
  const router = useRouter()

  const [kategoriList, setKategoriList] = useState<Kategori[]>([])
  const [form, setForm] = useState({
    nama: '',
    deskripsi: '',
    nominal: '',
    tanggal_nagih: '',
    tanggal_tempo: '',
    kategori_id: '',
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('') // Pesan error/sukses

  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const res = await axios.get('/api/kategori') // Pastikan endpoint ini benar
        setKategoriList(res.data)
      } catch (error) {
        console.error('Gagal mengambil data kategori:', error)
        setMessage('Gagal memuat kategori. Silakan refresh halaman.')
      }
    }
    fetchKategori()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target

    if (name === 'nominal') {
      // Hanya izinkan angka, hapus semua karakter non-digit
      const raw = value.replace(/\D/g, '') 
      setForm({ ...form, nominal: raw })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('') // Bersihkan pesan sebelumnya

    try {
      const payload = {
        ...form,
        nominal: parseFloat(form.nominal),
        kategori_id: parseInt(form.kategori_id),
      }

      await axios.post('/api/iuran/sekali', payload) // Pastikan endpoint ini benar

      // Jika berhasil, langsung redirect tanpa alert
      router.push('/dashboard/rt/iuran')
    } catch (error: any) {
      console.error('Gagal tambah iuran:', error)
      if (axios.isAxiosError(error) && error.response) {
        setMessage(`❌ Gagal tambah iuran: ${error.response.data.message || error.response.statusText}`)
      } else {
        setMessage('❌ Terjadi kesalahan tidak terduga saat menambahkan iuran.')
      }
    } finally {
      setLoading(false) // Nonaktifkan loading setelah selesai (baik sukses/gagal)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-xl shadow-lg p-6 sm:p-8 transform transition-all hover:scale-[1.005] duration-300 ease-in-out">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800 tracking-tight">
          Tambah Iuran Sekali Pakai
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6"> {/* Perbaiki space-y */}
          <BackButton /> {/* Tombol kembali */}

          {/* Nama Iuran */}
          <div>
            <label htmlFor="nama" className="block mb-2 text-sm font-semibold text-gray-700">Nama Iuran</label>
            <input
              type="text"
              id="nama"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              placeholder="Masukkan nama iuran"
              className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 bg-gray-50 text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-3 focus:ring-blue-400 focus:border-blue-400 transition duration-200 ease-in-out shadow-sm"
              required
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label htmlFor="deskripsi" className="block mb-2 text-sm font-semibold text-gray-700">Deskripsi</label>
            <textarea
              id="deskripsi"
              name="deskripsi"
              value={form.deskripsi}
              onChange={handleChange}
              placeholder="Contoh: Iuran pembangunan pos ronda"
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 bg-gray-50 text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-3 focus:ring-blue-400 focus:border-blue-400 transition duration-200 ease-in-out shadow-sm resize-y"
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
                name="nominal"
                value={form.nominal ? Number(form.nominal).toLocaleString('id-ID') : ''}
                onChange={handleChange}
                placeholder="100.000"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-gray-300 bg-gray-50 text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-3 focus:ring-blue-400 focus:border-blue-400 transition duration-200 ease-in-out shadow-sm"
                required
              />
            </div>
          </div>

          {/* Tanggal Nagih & Tempo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5"> {/* Perbaiki gap */}
            <div>
              <label htmlFor="tanggal_nagih" className="block mb-2 text-sm font-semibold text-gray-700">Tanggal Nagih</label>
              <input
                type="date"
                id="tanggal_nagih"
                name="tanggal_nagih"
                value={form.tanggal_nagih}
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
                value={form.tanggal_tempo}
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
                value={form.kategori_id}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 bg-gray-50 text-base text-gray-800 focus:outline-none focus:ring-3 focus:ring-blue-400 focus:border-blue-400 transition duration-200 ease-in-out shadow-sm appearance-none"
                required
              >
                <option value="" disabled>Pilih Kategori</option>
                {kategoriList.map((kategori) => (
                  <option key={kategori.id} value={kategori.id}>
                    {kategori.nama}
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
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                Menyimpan...
              </div>
            ) : 'Simpan Iuran'}
          </button>

          {message && (
            <p className="text-sm mt-2 text-center text-red-500 font-medium p-2 bg-red-50 rounded-md border border-red-200">{message}</p>
          )}
        </form>
      </div>
    </div>
  )
}
