'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import BackButton from '../Buttons/BackButton'

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
      await axios.post('/api/iuran/bulanan', {
        ...form,
        nominal: parseFloat(form.nominal),
        kategori_id: parseInt(form.kategori_id),
      })

      router.push('/dashboard/rw/iuran')
    } catch (error) {
      alert('Gagal menambahkan iuran.')
      console.error(error)
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white border border-gray-200 shadow-md rounded-lg p-6 sm:p-8 text-gray-800">
      <h2 className="text-2xl font-bold mb-6 text-center">Tambah Data Iuran RW</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <BackButton />

        {/* Nama Iuran */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Nama Iuran</label>
          <input
            type="text"
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
            className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Contoh: Iuran keamanan RW"
            required
          />
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Deskripsi</label>
          <input
            type="text"
            value={form.deskripsi}
            onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
            className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Penjelasan singkat tentang iuran"
            required
          />
        </div>

        {/* Nominal */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Nominal</label>
          <input
            type="text"
            inputMode="numeric"
            value={form.nominal ? Number(form.nominal).toLocaleString('id-ID') : ''}
            onChange={(e) => {
              const value = e.target.value.replace(/\./g, '').replace(/[^0-9]/g, '')
              setForm({ ...form, nominal: value })
            }}
            className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Contoh: 100000"
            required
          />
        </div>

        {/* Tanggal Nagih & Tempo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Tanggal Nagih</label>
            <input
              type="date"
              value={form.tanggal_nagih}
              onChange={(e) => setForm({ ...form, tanggal_nagih: e.target.value })}
              className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Tanggal Tempo</label>
            <input
              type="date"
              value={form.tanggal_tempo}
              onChange={(e) => setForm({ ...form, tanggal_tempo: e.target.value })}
              className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Kategori */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Kategori</label>
          <select
            value={form.kategori_id}
            onChange={(e) => setForm({ ...form, kategori_id: e.target.value })}
            className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="" disabled>
              Pilih kategori...
            </option>
            {kategoriOptions.map((kategori) => (
              <option key={kategori.id} value={kategori.id}>
                {kategori.label}
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-2 px-4 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold transition duration-200 disabled:opacity-50"
        >
          Simpan
        </button>
      </form>
    </div>
  )
}
