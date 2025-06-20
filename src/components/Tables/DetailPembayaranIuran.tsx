'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'

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

export default function DetailPembayaranIuran({ iuranId }: Props) {
  const [data, setData] = useState<Tagihan[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/iuran/${iuranId}/tagihan`)
      const json = await res.json()
      setData(json)
    } catch (err) {
      console.error('❌ Gagal fetch tagihan:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [iuranId])

  const filtered = data.filter((item) => {
    if (!item.kk) return false
    const noKK = item.kk.no_kk.toLowerCase()
    const nama = item.kk.nama_kepala_keluarga.toLowerCase()
    return noKK.includes(search.toLowerCase()) || nama.includes(search.toLowerCase())
  })

  if (loading) return <p className="p-4">Loading...</p>

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Detail Pembayaran Iuran</h2>

      <input
        type="text"
        placeholder="Cari No KK / Nama"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 px-3 py-2 border border-gray-300 rounded w-full max-w-md"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300 text-sm text-gray-800">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">No KK</th>
              <th className="border px-4 py-2">Nama Kepala Keluarga</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Tanggal Bayar</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <tr key={item.id}>
                  <td className="border px-4 py-2">{item.kk?.no_kk}</td>
                  <td className="border px-4 py-2">{item.kk?.nama_kepala_keluarga}</td>
                  <td className="border px-4 py-2 capitalize">
                    {item.status === 'lunas' ? (
                      <span className="text-green-600 font-medium">Sudah Bayar</span>
                    ) : (
                      <span className="text-red-600 font-medium">Belum Bayar</span>
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {item.tanggal_bayar
                      ? format(new Date(item.tanggal_bayar), 'dd-MM-yyyy')
                      : '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4 text-red-500">
                  Tidak ada data ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
