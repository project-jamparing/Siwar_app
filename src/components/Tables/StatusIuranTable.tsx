// Path: src/components/Tables/StatusIuranTable.tsx
'use client'

import { useEffect, useState } from 'react'
import { Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface StatusIuran {
  id: number
  nama: string // Nama Iuran
  total: number // Total KK yang terkait
  sudah: number // Jumlah KK yang sudah bayar
  belum: number // Jumlah KK yang belum bayar
}

export default function StatusIuranTable() {
  const [list, setList] = useState<StatusIuran[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [loading, setLoading] = useState(true) // Tambahkan state loading
  const router = useRouter()

  useEffect(() => {
    const fetchStatusIuran = async () => {
      setLoading(true) // Set loading true saat mulai fetch
      try {
        // API ini diasumsikan mengembalikan data status iuran per RW
        // dengan format { id, nama, total, sudah, belum }
        const res = await fetch('/api/iuran/status/rw') 
        if (!res.ok) {
          const errorData = await res.json()
          console.error("Failed to fetch status iuran from API:", errorData.message || res.statusText)
          setList([]) // Kosongkan list jika fetch gagal
          return;
        }
        let data = await res.json() as StatusIuran[] // Pastikan data bertipe StatusIuran[]

        // --- START: MODIFIKASI UNTUK PENGURUTAN DATA ---
        // Urutkan berdasarkan ID secara descending (terbaru di atas)
        data.sort((a, b) => b.id - a.id);
        // --- END: MODIFIKASI UNTUK PENGURUTAN DATA ---
        
        setList(data) // Set data yang berhasil di-fetch dan sudah diurutkan
      } catch (err) {
        console.error('❌ Gagal fetch status iuran RW:', err)
        setList([]) // Kosongkan list jika ada error
      } finally {
        setLoading(false) // Set loading false setelah selesai fetch
      }
    }

    fetchStatusIuran()
  }, []) // Dependency array kosong, hanya dijalankan sekali saat mount

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

  const renderPageNumbers = () => {
    const pages: (number | string)[] = []

    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 5) {
        pages.push(...Array.from({ length: 5 }, (_, i) => i + 1), '...')
        pages.push(totalPages - 1, totalPages)
      } else if (currentPage >= totalPages - 4) {
        pages.push(1, 2, '...')
        pages.push(...Array.from({ length: 5 }, (_, i) => totalPages - 4 + i))
      } else {
        pages.push(1, '...')
        pages.push(currentPage - 1, currentPage, currentPage + 1)
        pages.push('...', totalPages)
      }
    }

    return pages.map((page, index) =>
      typeof page === 'string' ? (
        <span key={`ellipsis-${index}`} className="px-3 py-1 text-gray-500 select-none">...</span>
      ) : (
        <button
          key={page}
          onClick={() => goToPage(page)}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition duration-150 ease-in-out ${
            currentPage === page
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white border border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 shadow-sm'
          }`}
        >
          {page}
        </button>
      )
    )
  }

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen font-sans text-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-center items-center mb-8"> 
          <h1 className="text-4xl font-extrabold text-gray-900 text-center w-full"> 
            Riwayat Iuran Warga
          </h1>
        </div>

        {/* Filter and Controls */}
        <div className="flex justify-end mb-6">
          <div className="flex items-center gap-2">
            <label htmlFor="tampilan" className="text-base font-medium text-gray-700">Tampilkan:</label>
            <select
              id="tampilan"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            >
              {[5, 10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto rounded-xl shadow-2xl border border-gray-200 bg-white">
          <table className="w-full table-auto text-base text-gray-700">
            <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <tr>
                <th className="px-5 py-3 text-left font-bold border-b-2 border-blue-800 rounded-tl-xl">Nama Iuran</th>
                <th className="px-5 py-3 text-center font-bold border-b-2 border-blue-800">Total KK</th>
                <th className="px-5 py-3 text-center font-bold border-b-2 border-blue-800">Sudah Bayar</th>
                <th className="px-5 py-3 text-center font-bold border-b-2 border-blue-800">Belum Bayar</th>
                <th className="px-5 py-3 text-center font-bold border-b-2 border-blue-800 rounded-tr-xl">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? ( // Tampilkan loading state
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mb-4"></div>
                      <p className="text-lg font-medium">Memuat data riwayat iuran...</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200 hover:bg-blue-50 transition-colors duration-200 ease-in-out">
                    <td className="px-5 py-3 font-medium text-gray-900">{item.nama}</td>
                    <td className="px-5 py-3 text-center">{item.total}</td>
                    <td className="px-5 py-3 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700 shadow-sm">
                        {item.sudah}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700 shadow-sm">
                        {item.belum}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button
                        onClick={() => router.push(`/dashboard/rw/iuran/${item.id}`)}
                        className="p-2 rounded-full bg-blue-500 text-white shadow-md hover:bg-blue-600 transition duration-200 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        title="Lihat Detail Iuran"
                      >
                        <Eye size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-red-600 font-medium bg-white">
                    Tidak ada data riwayat iuran ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-3">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-5 py-2 rounded-lg text-base font-semibold transition duration-200 ease-in-out shadow-md ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-white border border-blue-400 text-blue-700 hover:bg-blue-100 hover:border-blue-500'
              }`}
            >
              Previous
            </button>

            {renderPageNumbers()}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-5 py-2 rounded-lg text-base font-semibold transition duration-200 ease-in-out shadow-md ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-white border border-blue-400 text-blue-700 hover:bg-blue-100 hover:border-blue-500'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
