'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

interface Kategori {
  id: number
  nama: string
}

export default function FormTambahIuranSekali() {
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
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      await axios.post('/api/iuran/sekali', {
        ...form,
        nominal: parseFloat(form.nominal),
      })
      setMessage('✅ Iuran berhasil ditambahkan!')
      setForm({
        nama: '',
        deskripsi: '',
        nominal: '',
        tanggal_nagih: '',
        tanggal_tempo: '',
        kategori_id: '',
      })
    } catch (error: any) {
      setMessage(`❌ Gagal tambah iuran: ${error?.response?.data?.message || 'Error'}`)
    }

    setLoading(false)
  }

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg text-gray-800 dark:text-white">
      <h2 className="text-2xl font-bold mb-4">Tambah Iuran Sekali Pakai</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Nama Iuran</label>
          <input
            type="text"
            name="nama"
            value={form.nama}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Deskripsi</label>
          <textarea
            name="deskripsi"
            value={form.deskripsi}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Nominal (contoh: 10000)</label>
          <input
            type="number"
            name="nominal"
            value={form.nominal}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Tanggal Nagih</label>
          <input
            type="date"
            name="tanggal_nagih"
            value={form.tanggal_nagih}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Tanggal Tempo</label>
          <input
            type="date"
            name="tanggal_tempo"
            value={form.tanggal_tempo}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Kategori</label>
          <select
            name="kategori_id"
            value={form.kategori_id}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
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

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition duration-200 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Menyimpan...' : 'Simpan Iuran'}
        </button>

        {message && (
          <p className="text-sm mt-2 font-medium text-center">{message}</p>
        )}
      </form>
    </div>
  )
}