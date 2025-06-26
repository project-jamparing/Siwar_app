// Path: C:\Users\LENOVO\Siwar_app\src\components\Tables\DetailPembayaranIuranRT.tsx

'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'

interface Tagihan {
  id: number
  status: string
  tanggal_bayar: string | null
  kk: {
    no_kk: string
    nama_kepala_keluarga: string // Disini nama_kepala_keluarga sudah sesuai dengan output API
  } | null
}

interface Props {
  iuranId: number // ID Iuran yang akan ditampilkan detail pembayarannya
}

export default function DetailPembayaranIuranRT({ iuranId }: Props) {
  const [data, setData] = useState<Tagihan[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true) // Set loading true saat memulai fetch
        // Panggil API dengan iuranId yang diterima dari props
        const res = await fetch(`/api/iuran/rt/${iuranId}`)
        if (!res.ok) {
          // Tangani error jika respons tidak OK (e.g., 404, 405, 500)
          const errorText = await res.text() // Ambil teks error untuk debug
          throw new Error(`HTTP error! Status: ${res.status}, Message: ${errorText}`)
        }
        const json = await res.json()
        setData(Array.isArray(json) ? json : []) // Pastikan data adalah array
      } catch (err) {
        console.error('❌ Gagal fetch detail tagihan RT:', err)
        setData([]) // Kosongkan data jika ada error
      } finally {
        setLoading(false) // Set loading false setelah selesai (baik sukses/gagal)
      }
    }

    // Panggil fetchData setiap kali iuranId berubah
    fetchData()
  }, [iuranId]) // Dependency array memastikan useEffect berjalan saat iuranId berubah

  // Filter data berdasarkan input pencarian (No KK atau Nama Kepala Keluarga)
  const filtered = data.filter((item) => {
    // Jika item.kk null, abaikan item ini
    if (!item.kk) return false
    const noKK = item.kk.no_kk.toLowerCase()
    const nama = item.kk.nama_kepala_keluarga?.toLowerCase() ?? '' // Handle jika nama_kepala_keluarga bisa null

    const searchValue = search.toLowerCase()
    return noKK.includes(searchValue) || nama.includes(searchValue)
  })

  if (loading) {
    return <p className="p-4 text-center">Memuat detail pembayaran...</p>
  }

  if (data.length === 0 && !loading) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Detail Pembayaran Iuran RT</h2>
        <p className="text-center text-gray-600">Tidak ada data pembayaran untuk iuran ini.</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Detail Pembayaran Iuran RT</h2>

      <input
        type="text"
        placeholder="Cari No KK / Nama Kepala Keluarga..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 w-full max-w-md"
      />

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No KK
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama Kepala Keluarga
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal Bayar
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.kk?.no_kk || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.kk?.nama_kepala_keluarga || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {item.status === 'lunas' ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Sudah Bayar
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Belum Bayar
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.tanggal_bayar
                      ? format(new Date(item.tanggal_bayar), 'dd-MM-yyyy')
                      : '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  Tidak ada data yang cocok dengan pencarian Anda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}