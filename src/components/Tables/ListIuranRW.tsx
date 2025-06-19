'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Trash, Pencil, Ban } from 'lucide-react'

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

type ModalType = 'hapus' | 'nonaktif' | 'edit' | null

export default function ListIuranRW() {
  const [iurans, setIurans] = useState<Iuran[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedIuranId, setSelectedIuranId] = useState<number | null>(null)
  const [modalType, setModalType] = useState<ModalType>(null)

  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/iuran/list')
        setIurans(res.data)
      } catch (err) {
        console.error('Gagal mengambil data iuran', err)
      }
    }
    fetchData()
  }, [])

  const openModal = (type: ModalType, id: number) => {
    setModalType(type)
    setSelectedIuranId(id)
  }

  const closeModal = () => {
    setModalType(null)
    setSelectedIuranId(null)
  }

  const handleDelete = async () => {
    if (!selectedIuranId) return
    await axios.delete(`/api/iuran/${selectedIuranId}`)
    closeModal()
    const res = await axios.get('/api/iuran/list')
    setIurans(res.data)
  }

  const handleNonaktifkan = async () => {
    if (!selectedIuranId) return
    await axios.patch(`/api/iuran/nonaktifkan/${selectedIuranId}`)
    closeModal()
    const res = await axios.get('/api/iuran/list')
    setIurans(res.data)
  }

  const handleEdit = () => {
    if (!selectedIuranId) return
    router.push(`/dashboard/rw/iuran/edit/${selectedIuranId}`)
  }

  const totalPages = Math.ceil(iurans.length / itemsPerPage)
  const paginatedIurans = iurans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  return (
    <div className="p-4 bg-white text-gray-800">
      {/* Top Controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-sm">
          <label htmlFor="itemsPerPage" className="font-medium">
            Tampilkan:
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value))
              setCurrentPage(1)
            }}
            className="border border-gray-300 rounded px-3 py-1 bg-white text-gray-800"
          >
            {[5, 10, 20, 50, 100].map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => router.push('/dashboard/rw/iuran/tambah')}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded"
        >
          + Tambah Data Iuran
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-300 rounded shadow-sm">
        <table className="min-w-[1000px] w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Nama</th>
              <th className="px-4 py-2 border">Deskripsi</th>
              <th className="px-4 py-2 border">Nominal</th>
              <th className="px-4 py-2 border">Tanggal Nagih</th>
              <th className="px-4 py-2 border">Tanggal Tempo</th>
              <th className="px-4 py-2 border">Kategori</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginatedIurans.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4 text-red-600 font-medium">
                  Tidak ada data iuran.
                </td>
              </tr>
            ) : (
              paginatedIurans.map((iuran, idx) => (
                <tr
                  key={iuran.id}
                  className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}
                >
                  <td className="px-4 py-2 border">{iuran.nama}</td>
                  <td className="px-4 py-2 border">{iuran.deskripsi}</td>
                  <td className="px-4 py-2 border">Rp {iuran.nominal.toLocaleString('id-ID')}</td>
                  <td className="px-4 py-2 border">
                    {new Date(iuran.tanggal_nagih).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-4 py-2 border">
                    {new Date(iuran.tanggal_tempo).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-4 py-2 border">{iuran.kategori.nama}</td>
                  <td className="px-4 py-2 border">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        iuran.status === 'aktif'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {iuran.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 border text-center space-x-2">
                    <button
                      onClick={() => openModal('edit', iuran.id)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => openModal('hapus', iuran.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      <Trash size={16} />
                    </button>
                    <button
                      onClick={() => openModal('nonaktif', iuran.id)}
                      disabled={iuran.status === 'nonaktif'}
                      className={`px-3 py-1 rounded text-white ${
                        iuran.status === 'nonaktif'
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-gray-500 hover:bg-gray-600'
                      }`}
                    >
                      <Ban size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2 text-sm">
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

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => goToPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {i + 1}
            </button>
          ))}

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

      {/* Modal */}
      {modalType && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white border border-gray-300 rounded-lg shadow p-6 w-full max-w-sm">
            <p className="text-center text-gray-800 mb-4 text-sm font-medium">
              {modalType === 'hapus' && 'Apakah Anda yakin ingin menghapus data ini?'}
              {modalType === 'nonaktif' && 'Apakah Anda yakin ingin menonaktifkan iuran ini?'}
              {modalType === 'edit' && 'Apakah Anda ingin mengedit data ini?'}
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  if (modalType === 'hapus') handleDelete()
                  if (modalType === 'nonaktif') handleNonaktifkan()
                  if (modalType === 'edit') handleEdit()
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Ya
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
