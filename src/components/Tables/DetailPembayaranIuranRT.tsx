// Path: src/components/Tables/DetailPembayaranIuranRT.tsx
'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns' 
import BackButton from '@/components/Buttons/BackButton' 

interface Tagihan {
  id: number
  status: string
  tanggal_bayar: string | null
  kk: {
    no_kk: string
    nama_kepala_keluarga: string
  } | null
}

interface Props {
  iuranId: number
}

export default function DetailPembayaranIuranRT({ iuranId }: Props) {
  const [data, setData] = useState<Tagihan[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true) 
      try {
        const res = await fetch(`/api/iuran/rt/${iuranId}`) 
        if (!res.ok) {
          const errorData = await res.json()
          console.error("Failed to fetch tagihan RT:", errorData.message || res.statusText)
          setData([])
          return;
        }
        const json = await res.json()
        setData(Array.isArray(json) ? json : [])
      } catch (err) {
        console.error('❌ Gagal fetch tagihan RT:', err)
        setData([])
      } finally {
        setLoading(false) 
      }
    }

    fetchData()
  }, [iuranId])

  const filtered = data.filter((item) => {
    if (!item.kk) return false 
    const noKK = item.kk.no_kk.toLowerCase()
    const nama = item.kk.nama_kepala_keluarga?.toLowerCase() ?? ''
    return noKK.includes(search.toLowerCase()) || nama.includes(search.toLowerCase())
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 font-sans">
        <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Memuat detail pembayaran...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen font-sans text-gray-800 flex items-start justify-center">
      <div className="w-full max-w-4xl bg-white border border-gray-200 rounded-xl shadow-lg p-6 sm:p-8 transform transition-all duration-300 ease-in-out">
        {/* Tombol kembali */}
        <BackButton /> 

        <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800 tracking-tight">
          Detail Pembayaran Iuran RT
        </h2>

        {/* Input Pencarian */}
        <input
          type="text"
          placeholder="Cari No KK / Nama Kepala Keluarga..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-6 w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 bg-gray-50 text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-3 focus:ring-blue-400 focus:border-blue-400 transition duration-200 ease-in-out shadow-sm"
        />

        {/* Tabel Detail */}
        <div className="overflow-x-auto rounded-xl shadow-2xl border border-gray-200 bg-white">
          <table className="w-full table-auto text-base text-gray-700">
            <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <tr>
                <th className="px-5 py-3 text-left font-bold border-b-2 border-blue-800 rounded-tl-xl">No KK</th>
                <th className="px-5 py-3 text-left font-bold border-b-2 border-blue-800">Nama Kepala Keluarga</th>
                <th className="px-5 py-3 text-left font-bold border-b-2 border-blue-800">Status</th>
                <th className="px-5 py-3 text-left font-bold border-b-2 border-blue-800 rounded-tr-xl">Tanggal Bayar</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((item) => (
                  <tr 
                    key={item.id} 
                    className="border-b border-gray-200 hover:bg-blue-50 transition-colors duration-200 ease-in-out"
                  >
                    <td className="px-5 py-3 font-medium text-gray-900">{item.kk?.no_kk || '-'}</td>
                    <td className="px-5 py-3">{item.kk?.nama_kepala_keluarga || '-'}</td>
                    <td className="px-5 py-3 capitalize">
                      {item.status === 'lunas' ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700 shadow-sm">
                          Sudah Bayar
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700 shadow-sm">
                          Belum Bayar
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {item.tanggal_bayar
                        ? format(new Date(item.tanggal_bayar), 'dd MMMM yyyy', { locale: (localeId as any) }) // PERBAIKAN DI SINI
                        : '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-red-600 font-medium bg-white">
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Untuk date-fns locale
import { id as localeId } from 'date-fns/locale';
