// Path: src/components/Tables/ListIuranRW.tsx
'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Trash, Pencil, Ban, Plus } from 'lucide-react'
import Link from 'next/link'

// Definisi interface untuk Iuran
interface Iuran {
  id: number
  nama: string
  deskripsi: string
  nominal: number
  tanggal_nagih: string
  tanggal_tempo: string
  status: 'aktif' | 'nonaktif'
  kategori: {
    nama: string
  }
}

// Tipe untuk modal yang ditampilkan (hapus, nonaktif, edit)
type ModalType = 'hapus' | 'nonaktif' | 'edit' | null

export default function ListIuranRW() {
  // State variables
  const [iurans, setIurans] = useState<Iuran[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedIuranId, setSelectedIuranId] = useState<number | null>(null)
  const [modalType, setModalType] = useState<ModalType>(null)
  const [loading, setLoading] = useState(true)

  // Next.js Router hook
  const router = useRouter()

  // Derived values for pagination (calculated on each render)
  // These are intentionally placed here to ensure they update with state changes
  const totalPages = Math.ceil(iurans.length / itemsPerPage)
  const paginatedIurans = iurans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Fungsi untuk navigasi paginasi (DIPASTIKAN DI SINI DEFINISINYA)
  const goToPage = (page: number) => {
    // Memastikan page yang dituju valid
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // Fungsi untuk merender nomor-nomor halaman paginasi (DIPASTIKAN DI SINI DEFINISINYA)
  const renderPageNumbers = () => {
    const pages: (number | string)[] = []

    // Logika paginasi cerdas untuk menampilkan hanya sebagian nomor halaman jika banyak
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

  // Fungsi untuk mengambil data iuran dari API
  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/iuran/list')
      let data = res.data as Iuran[] // Asumsikan data adalah array Iuran

      // --- START: MODIFIKASI UNTUK PENGURUTAN DATA ---
      data.sort((a, b) => {
        // Urutkan berdasarkan tanggal_nagih (terbaru pertama)
        const dateA_nagih = new Date(a.tanggal_nagih).getTime();
        const dateB_nagih = new Date(b.tanggal_nagih).getTime();
        if (dateA_nagih !== dateB_nagih) {
          return dateB_nagih - dateA_nagih; // Descending
        }

        // Jika tanggal_nagih sama, urutkan berdasarkan tanggal_tempo (terbaru pertama)
        const dateA_tempo = new Date(a.tanggal_tempo).getTime();
        const dateB_tempo = new Date(b.tanggal_tempo).getTime();
        if (dateA_tempo !== dateB_tempo) {
          return dateB_tempo - dateA_tempo; // Descending
        }

        // Jika kedua tanggal sama, urutkan berdasarkan ID (ID lebih besar berarti lebih baru)
        return b.id - a.id; // Descending
      });
      // --- END: MODIFIKASI UNTUK PENGURUTAN DATA ---
      
      setIurans(data) // Set data yang sudah diurutkan
    } catch (err) {
      console.error('Gagal mengambil data iuran:', err)
      // Display a more user-friendly message or alert here if needed
    } finally {
      setLoading(false)
    }
  }

  // Effect hook untuk memuat data saat komponen pertama kali di-mount
  useEffect(() => {
    fetchData()
  }, []) // Dependency array kosong, hanya dijalankan sekali saat mount

  // Fungsi untuk membuka modal konfirmasi
  const openModal = (type: ModalType, id: number) => {
    setModalType(type)
    setSelectedIuranId(id)
  }

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setModalType(null)
    setSelectedIuranId(null)
  }

  // Fungsi untuk menangani penghapusan iuran
  const handleDelete = async () => {
    if (!selectedIuranId) return

    try {
      await axios.delete(`/api/iuran/bulanan/${selectedIuranId}`) // Pastikan endpoint DELETE ini benar
      closeModal()
      await fetchData() // Panggil fetchData untuk memuat ulang data (akan terurut otomatis)
      // alert('Iuran berhasil dihapus!') // Uncomment jika perlu alert
    } catch (error) {
      console.error('Gagal menghapus iuran:', error)
      if (axios.isAxiosError(error) && error.response) {
        alert(`Gagal menghapus iuran: ${error.response.data.message || error.response.statusText}`)
      } else {
        alert('Terjadi kesalahan saat menghapus iuran.')
      }
    }
  }

  // Fungsi untuk menangani penonaktifkan iuran
  const handleNonaktifkan = async () => {
    if (!selectedIuranId) return

    try {
      await axios.patch(`/api/iuran/bulanan/${selectedIuranId}`, { status: 'nonaktif' }) // Pastikan endpoint PATCH ini benar
      closeModal()
      await fetchData() // Panggil fetchData untuk memuat ulang data (akan terurut otomatis)
      // alert('Iuran berhasil dinonaktifkan!') // Uncomment jika perlu alert
    } catch (error) {
      console.error('Gagal menonaktifkan iuran:', error)
      if (axios.isAxiosError(error) && error.response) {
        alert(`Gagal menonaktifkan iuran: ${error.response.data.message || error.response.statusText}`)
      } else {
        alert('Terjadi kesalahan saat menonaktifkan iuran.')
      }
    }
  }

  // Fungsi untuk navigasi ke halaman edit
  const handleEdit = () => {
    if (!selectedIuranId) return
    router.push(`/dashboard/rw/iuran/edit/${selectedIuranId}`)
  }


  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen font-sans text-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center mb-8 relative">
          <div className="hidden sm:block sm:w-1/3"></div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 sm:mb-0 w-full sm:w-1/3 text-center">
            Daftar Iuran Bulanan (RW)
          </h1>
          <div className="w-full sm:w-1/3 flex justify-center sm:justify-end">
            <Link href="/dashboard/rw/iuran/tambah">
              <button className="flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105">
                <Plus size={20} className="mr-2" />
                Tambah Data Iuran
              </button>
            </Link>
          </div>
        </div>

        {/* Filter and Controls */}
        <div className="flex justify-end mb-6">
          <div className="flex items-center gap-2">
            <label htmlFor="itemsPerPage" className="text-base font-medium text-gray-700">Tampilkan:</label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            >
              {[5, 10, 20, 50, 100].map((val) => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto rounded-xl shadow-2xl border border-gray-200 bg-white">
          <table className="w-full table-auto text-base text-gray-700">
            <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <tr>
                <th className="px-5 py-3 text-left font-bold border-b-2 border-blue-800 rounded-tl-xl">Nama</th>
                <th className="px-5 py-3 text-left font-bold border-b-2 border-blue-800">Deskripsi</th>
                <th className="px-5 py-3 text-left font-bold border-b-2 border-blue-800">Nominal</th>
                <th className="px-5 py-3 text-left font-bold border-b-2 border-blue-800">Tanggal Nagih</th>
                <th className="px-5 py-3 text-left font-bold border-b-2 border-blue-800">Tanggal Tempo</th>
                <th className="px-5 py-3 text-left font-bold border-b-2 border-blue-800">Kategori</th>
                <th className="px-5 py-3 text-left font-bold border-b-2 border-blue-800">Status</th>
                <th className="px-5 py-3 text-center font-bold border-b-2 border-blue-800 rounded-tr-xl">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? ( // Tampilkan loading state
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mb-4"></div>
                      <p className="text-lg font-medium">Memuat data iuran...</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedIurans.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-red-600 font-medium bg-white">
                    Tidak ada data iuran ditemukan.
                  </td>
                </tr>
              ) : (
                paginatedIurans.map((iuran) => (
                  <tr
                    key={iuran.id}
                    className="border-b border-gray-200 hover:bg-blue-50 transition-colors duration-200 ease-in-out"
                  >
                    <td className="px-5 py-3 font-medium text-gray-900">{iuran.nama}</td>
                    <td className="px-5 py-3">{iuran.deskripsi}</td>
                    <td className="px-5 py-3 font-semibold text-gray-900">Rp {iuran.nominal.toLocaleString('id-ID')}</td>
                    <td className="px-5 py-3">
                      {new Date(iuran.tanggal_nagih).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-5 py-3">
                      {new Date(iuran.tanggal_tempo).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-5 py-3">{iuran.kategori.nama}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold shadow-sm ${
                          iuran.status === 'aktif'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {iuran.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center space-x-2">
                      <button
                        onClick={() => openModal('edit', iuran.id)}
                        className="p-2 rounded-full bg-yellow-500 text-white shadow-md hover:bg-yellow-600 transition duration-200 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                        title="Edit Iuran"
                      >
                        <Pencil size={20} />
                      </button>
                      <button
                        onClick={() => openModal('hapus', iuran.id)}
                        className="p-2 rounded-full bg-red-500 text-white shadow-md hover:bg-red-600 transition duration-200 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-300"
                        title="Hapus Iuran"
                      >
                        <Trash size={20} />
                      </button>
                      <button
                        onClick={() => openModal('nonaktif', iuran.id)}
                        disabled={iuran.status === 'nonaktif'}
                        className={`p-2 rounded-full text-white shadow-md transition duration-200 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-300 ${
                          iuran.status === 'nonaktif'
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gray-500 hover:bg-gray-600'
                        }`}
                        title="Nonaktifkan Iuran"
                      >
                        <Ban size={20} />
                      </button>
                    </td>
                  </tr>
                ))
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

        {/* Modal Konfirmasi */}
        {modalType && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white border border-gray-300 rounded-xl shadow-2xl p-8 w-full max-w-sm transform transition-all duration-300 ease-out scale-100 opacity-100">
              <p className="text-center text-gray-800 mb-6 text-lg font-medium">
                {modalType === 'hapus' && 'Apakah Anda yakin ingin menghapus data ini secara permanen?'}
                {modalType === 'nonaktif' && 'Apakah Anda yakin ingin menonaktifkan iuran ini? Tagihan tidak akan muncul lagi.'}
                {modalType === 'edit' && 'Apakah Anda ingin mengedit data iuran ini? Anda akan diarahkan ke halaman edit.'}
              </p>
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={() => {
                    if (modalType === 'hapus') handleDelete()
                    if (modalType === 'nonaktif') handleNonaktifkan()
                    if (modalType === 'edit') handleEdit()
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition duration-200 shadow-md transform hover:scale-105"
                >
                  Ya
                </button>
                <button
                  onClick={closeModal}
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
