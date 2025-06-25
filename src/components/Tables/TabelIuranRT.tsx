// Path: src/components/Tables/TabelTagihanRT.tsx
'use client'

import { useEffect, useState } from 'react'
import { Check, Plus } from 'lucide-react' // Tambahkan Plus icon
import Link from 'next/link' // Import Link for "Tambah Iuran" button

// Definisi interface untuk data tagihan RT
interface TagihanRT {
  id: number
  nama_iuran: string
  no_kk: string
  nama_kepala_keluarga: string
  status: 'sudah bayar' | 'belum bayar'
}

export default function TabelTagihanRT() {
  const [tagihan, setTagihan] = useState<TagihanRT[]>([]) // Gunakan interface TagihanRT
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true) // Tambahkan state loading

  const fetchTagihan = async () => {
    setLoading(true) // Set loading true saat mulai fetch
    try {
      // Pastikan Anda menambahkan parameter rt_id di sini jika API memerlukannya
      // Contoh: const res = await fetch(`/api/tagihan/rt?rt_id=${ID_RT_ANDA}`);
      const res = await fetch('/api/tagihan/rt?rt_id') // Catatan: rt_id perlu nilai dinamis
      const data = await res.json()
      if (data.success) {
        setTagihan(data.data)

        // --- START: MODIFIKASI UNTUK PENGURUTAN DATA (Terbaru di atas) ---
        // Asumsi 'id' lebih besar berarti data lebih baru
        data.data.sort((a: TagihanRT, b: TagihanRT) => b.id - a.id);
        setTagihan(data.data);
        // --- END: MODIFIKASI UNTUK PENGURUTAN DATA ---

      } else {
        console.error('Failed to fetch tagihan from API:', data.message || res.statusText);
        setTagihan([]); // Kosongkan list jika fetch gagal
      }
    } catch (err) {
      console.error('❌ Gagal fetch tagihan RT:', err)
      setTagihan([]) // Kosongkan list jika ada error
    } finally {
      setLoading(false) // Set loading false setelah selesai fetch
    }
  }

  const handleConfirm = async () => {
    if (!selectedId) return
    try {
      // Menggunakan fetch API bawaan
      const res = await fetch(`/api/tagihan/${selectedId}/bayar`, { 
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await res.json();
      if (res.ok && result.success) { // Cek status HTTP dan properti success dari respons
        setSelectedId(null); // Tutup modal
        fetchTagihan(); // Muat ulang data
        // alert(result.message || 'Tagihan berhasil ditandai lunas!'); // Notifikasi sukses
      } else {
        console.error('Failed to confirm payment:', result.message || res.statusText);
        alert(`Gagal menandai lunas: ${result.message || 'Terjadi kesalahan.'}`);
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      alert('Terjadi kesalahan saat mengkonfirmasi pembayaran.');
    }
  }

  useEffect(() => {
    fetchTagihan()
  }, [])

  const filteredData = tagihan.filter((t) =>
    t.no_kk.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.nama_kepala_keluarga.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.nama_iuran.toLowerCase().includes(searchQuery.toLowerCase()) // Tambahkan pencarian nama iuran
  )

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
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
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen font-sans text-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center mb-8 relative">
          <div className="hidden sm:block sm:w-1/3"></div> {/* Untuk mengimbangi tombol kanan */}
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 sm:mb-0 w-full sm:w-1/3 text-center">
            Daftar Iuran RT
          </h1>
          <div className="w-full sm:w-1/3 flex justify-center sm:justify-end">
            {/* Mengarahkan ke halaman tambah iuran RT, sesuaikan jika ada path lain */}
            <Link href="/dashboard/rt/iuran/tambah"> 
              <button className="flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105">
                <Plus size={20} className="mr-2" />
                Tambah Iuran
              </button>
            </Link>
          </div>
        </div>

        {/* Filter and Controls */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4 text-gray-800">
          <div className="flex items-center gap-2">
            <label htmlFor="tampilan" className="text-base font-medium text-gray-700">
              Tampilkan:
            </label>
            <select
              id="tampilan"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg shadow-sm text-base bg-white focus:outline-none focus:ring-3 focus:ring-blue-400 focus:border-blue-400 transition duration-150 ease-in-out"
            >
              {[5, 10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Cari No KK / Nama Iuran / Nama KK..." // Perbarui placeholder
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 bg-gray-50 text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-3 focus:ring-blue-400 focus:border-blue-400 transition duration-200 ease-in-out shadow-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl shadow-2xl border border-gray-200 bg-white">
          <table className="w-full table-auto text-base text-gray-700">
            <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <tr>
                <th className="px-5 py-3 text-left font-bold border-b-2 border-blue-800 rounded-tl-xl">Nama Iuran</th>
                <th className="px-5 py-3 text-left font-bold border-b-2 border-blue-800">No KK</th>
                <th className="px-5 py-3 text-left font-bold border-b-2 border-blue-800">Kepala Keluarga</th>
                <th className="px-5 py-3 text-left font-bold border-b-2 border-blue-800">Status</th>
                <th className="px-5 py-3 text-center font-bold border-b-2 border-blue-800 rounded-tr-xl">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? ( // Tampilkan loading state
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mb-4"></div>
                      <p className="text-lg font-medium">Memuat data tagihan...</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((t: TagihanRT) => (
                  <tr key={t.id} className="border-b border-gray-200 hover:bg-blue-50 transition-colors duration-200 ease-in-out">
                    <td className="px-5 py-3 font-medium text-gray-900">{t.nama_iuran}</td>
                    <td className="px-5 py-3">{t.no_kk}</td>
                    <td className="px-5 py-3">{t.nama_kepala_keluarga}</td>
                    <td className="px-5 py-3 font-semibold">
                      {t.status === 'sudah bayar' ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700 shadow-sm">
                          Sudah Bayar
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700 shadow-sm">
                          Belum Bayar
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-center">
                      {t.status === 'belum bayar' && (
                        <button
                          onClick={() => setSelectedId(t.id)}
                          className="p-2 rounded-full bg-green-500 text-white shadow-md hover:bg-green-600 transition duration-200 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-300"
                          title="Tandai Sudah Bayar"
                        >
                          <Check size={20} /> {/* Perbesar ukuran ikon */}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-red-600 font-medium bg-white">
                    Tidak ada data tagihan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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

        {/* Modal Konfirmasi */}
        {selectedId && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white border border-gray-300 rounded-xl shadow-2xl p-8 w-full max-w-sm transform transition-all duration-300 ease-out scale-100 opacity-100 text-center">
              <p className="mb-6 text-gray-800 text-lg font-medium">
                Apakah Anda yakin warga ini telah membayar?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleConfirm}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition duration-200 shadow-md transform hover:scale-105"
                >
                  Ya
                </button>
                <button
                  onClick={() => setSelectedId(null)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-lg font-semibold transition duration-200 shadow-md transform hover:scale-105"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
