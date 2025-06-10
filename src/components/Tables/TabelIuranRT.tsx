'use client'
import { useEffect, useState } from 'react'

export default function TabelTagihanRT() {
  const [tagihan, setTagihan] = useState([])

  const fetchTagihan = async () => {
    const res = await fetch('/api/tagihan/rt?rt_id') // ganti sesuai rt_id user login
    const data = await res.json()
    console.log('📦 DATA TAGIHAN:', data)
    if (data.success) {
      setTagihan(data.data) // ambil dari data.data
    }
  }
  

  const handleKonfirmasi = async (id: number) => {
    await fetch(`/api/tagihan/${id}/bayar`, {
      method: 'PATCH'
    })
    fetchTagihan() // refresh
  }

  useEffect(() => {
    fetchTagihan()
  }, [])

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Daftar Tagihan Warga</h2>
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-200 text-gray-800">
            <th className="p-2 border">Nama Iuran</th>
            <th className="p-2 border">No KK</th>
            <th className="p-2 border">Kepala Keluarga</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(tagihan) && tagihan.length > 0 ? (
            tagihan.map((t: any) => (
              <tr key={t.id}>
                <td className="p-2 border text-gray-800">{t.nama_iuran}</td>
                <td className="p-2 border text-gray-800">{t.no_kk}</td>
                <td className="p-2 border text-gray-800">{t.nama_kepala_keluarga}</td>
                <td className="p-2 border text-gray-800">
                  {t.status === 'sudah bayar' ? (
                    <span className="text-green-600 font-semibold">Sudah Bayar</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Belum Bayar</span>
                  )}
                </td>
                <td className="p-2 border">
                  {t.status === 'belum bayar' && (
                    <button
                      onClick={() => handleKonfirmasi(t.id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Sudah Bayar
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center p-4 text-red-600">
                Tidak ada data tagihan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}