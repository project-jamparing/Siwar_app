'use client'

import { useEffect, useState } from 'react'
import { Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface StatusIuran {
  id: number
  nama: string
  total: number
  sudah: number
  belum: number
}

export default function StatusIuranRTTable() {
  const [list, setList] = useState<StatusIuran[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/iuran/status/rt')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => setList(data))
      .catch((err) => {
        console.error('❌ Gagal fetch iuran RT:', err.message)
      })
  }, [])

  const totalPages = Math.ceil(list.length / itemsPerPage)
  const paginatedData = list.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const renderPageNumbers = () =>
    Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
      <button
        key={page}
        onClick={() => goToPage(page)}
        className={`px-3 py-1 rounded ${
          currentPage === page
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 hover:bg-gray-300'
        }`}
      >
        {page}
      </button>
    ))

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-8">
      <h1 className="text-2xl font-bold text-center mb-6 text-black">
        Riwayat Tagihan Warga RT
      </h1>

      <div className="flex justify-end mb-4">
        <label htmlFor="tampilan" className="mr-2 text-sm font-medium text-gray-700">
          Tampilan:
        </label>
        <select
          id="tampilan"
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value))
            setCurrentPage(1)
          }}
          className="border border-gray-300 rounded px-3 py-1 text-gray-800"
        >
          {[5, 10, 20, 50].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      <table className="w-full border text-sm text-black mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-left">Nama Iuran</th>
            <th className="border px-4 py-2 text-center">Total</th>
            <th className="border px-4 py-2 text-center text-green-700">Sudah Bayar</th>
            <th className="border px-4 py-2 text-center text-red-700">Belum Bayar</th>
            <th className="border px-4 py-2 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{item.nama}</td>
              <td className="border px-4 py-2 text-center">{item.total}</td>
              <td className="border px-4 py-2 text-center text-green-700">{item.sudah}</td>
              <td className="border px-4 py-2 text-center text-red-700">{item.belum}</td>
              <td className="border px-4 py-2 text-center">
                <button
                  onClick={() => router.push(`/dashboard/rt/iuran/${item.id}`)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Eye size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex justify-center mt-2 space-x-2 text-sm">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Prev
          </button>

          {renderPageNumbers()}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
