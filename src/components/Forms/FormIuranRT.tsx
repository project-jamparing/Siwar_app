'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import BackButton from '../Buttons/BackButton'

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
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchKategori = async () => {
      const res = await axios.get('/api/kategori')
      setKategoriList(res.data)
    }
    fetchKategori()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target

    if (name === 'nominal') {
      const raw = value.replace(/\./g, '').replace(/[^0-9]/g, '')
      setForm({ ...form, nominal: raw })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const payload = {
        ...form,
        nominal: parseFloat(form.nominal),
        kategori_id: parseInt(form.kategori_id), // ✅ FIX DISINI
      }

      await axios.post('/api/iuran/sekali', payload)

      router.push('/dashboard/rt/iuran')
    } catch (error: any) {
      setMessage(`❌ Gagal tambah iuran: ${error?.response?.data?.message || 'Error'}`)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 sm:p-8 bg-white rounded-lg shadow border border-gray-200 text-gray-800">
      <h2 className="text-xl sm:text-2xl font-bold mb-6">Tambah Iuran Sekali Pakai</h2>
      <BackButton />
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nama Iuran */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Nama Iuran</label>
          <input
            type="text"
            name="nama"
            value={form.nama}
            onChange={handleChange}
            placeholder="Masukkan nama iuran"
            className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Deskripsi</label>
          <textarea
            name="deskripsi"
            value={form.deskripsi}
            onChange={handleChange}
            placeholder="Contoh: Iuran pembangunan pos ronda"
            rows={3}
            className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Nominal */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Nominal</label>
          <input
            type="text"
            inputMode="numeric"
            name="nominal"
            value={
              form.nominal ? Number(form.nominal).toLocaleString('id-ID') : ''
            }
            onChange={handleChange}
            placeholder="100.000"
            className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Tanggal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Tanggal Nagih</label>
            <input
              type="date"
              name="tanggal_nagih"
              value={form.tanggal_nagih}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Tanggal Tempo</label>
            <input
              type="date"
              name="tanggal_tempo"
              value={form.tanggal_tempo}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Kategori */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Kategori</label>
          <select
            name="kategori_id"
            value={form.kategori_id}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Pilih Kategori</option>
            {kategoriList.map((kategori) => (
              <option key={kategori.id} value={kategori.id}>
                {kategori.nama}
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-2 px-4 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold transition duration-200 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Menyimpan...' : 'Simpan Iuran'}
        </button>

        {message && (
          <p className="text-sm mt-2 text-center text-red-500 font-medium">{message}</p>
        )}
      </form>
    </div>
  )
}
