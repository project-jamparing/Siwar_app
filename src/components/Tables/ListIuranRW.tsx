'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Trash, Pencil, Ban } from 'lucide-react';

interface Iuran {
  id: number;
  nama: string;
  deskripsi: string;
  nominal: number;
  tanggal_nagih: string;
  tanggal_tempo: string;
  status: 'aktif' | 'nonaktif';
  kategori: {
    nama: string;
  };
}

type ModalType = 'hapus' | 'nonaktif' | 'edit' | null;

export default function ListIuranRW() {
  const [iurans, setIurans] = useState<Iuran[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedIuranId, setSelectedIuranId] = useState<number | null>(null);
  const [modalType, setModalType] = useState<ModalType>(null);

  const router = useRouter();

  const fetchData = async () => {
    try {
      const res = await axios.get('/api/iuran/list');
      setIurans(res.data);
    } catch (err) {
      console.error('Gagal mengambil data iuran', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (type: ModalType, id: number) => {
    setModalType(type);
    setSelectedIuranId(id);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedIuranId(null);
  };

  const handleDelete = async () => {
    if (!selectedIuranId) return;
    try {
      await axios.delete(`/api/iuran/${selectedIuranId}`);
      closeModal();
      fetchData();
    } catch {
    }
  };

  const handleNonaktifkan = async () => {
    if (!selectedIuranId) return;
    try {
      await axios.patch(`/api/iuran/nonaktifkan/${selectedIuranId}`);
      closeModal();
      fetchData();
    } catch {
    }
  };

  const handleEdit = () => {
    if (!selectedIuranId) return;
    router.push(`/dashboard/rw/iuran/edit/${selectedIuranId}`);
  };

  const totalPages = Math.ceil(iurans.length / itemsPerPage);
  const paginatedIurans = iurans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="relative overflow-x-auto">
      {/* Bar Atas */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-sm text-black">
          <label htmlFor="itemsPerPage" className="font-medium">
            Tampilkan:
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded px-3 py-1 bg-white text-black"
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
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
        >
          + Tambah Data Iuran
        </button>
      </div>

      {/* Tabel */}
      <table className="min-w-[900px] w-full border border-gray-300 rounded shadow-sm text-black">
        <thead className="bg-gray-100 text-black">
          <tr>
            <th className="border px-4 py-2 text-left">Nama</th>
            <th className="border px-4 py-2 text-left">Deskripsi</th>
            <th className="border px-4 py-2 text-left">Nominal</th>
            <th className="border px-4 py-2 text-left">Tanggal Nagih</th>
            <th className="border px-4 py-2 text-left">Tanggal Tempo</th>
            <th className="border px-4 py-2 text-left">Kategori</th>
            <th className="border px-4 py-2 text-left">Status</th>
            <th className="border px-4 py-2 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {paginatedIurans.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-4">
                Tidak ada data iuran.
              </td>
            </tr>
          ) : (
            paginatedIurans.map((iuran, index) => (
              <tr
                key={iuran.id}
                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}
              >
                <td className="border px-4 py-2">{iuran.nama}</td>
                <td className="border px-4 py-2">{iuran.deskripsi}</td>
                <td className="border px-4 py-2">Rp {iuran.nominal.toLocaleString('id-ID')}</td>
                <td className="border px-4 py-2">
                  {new Date(iuran.tanggal_nagih).toLocaleDateString('id-ID')}
                </td>
                <td className="border px-4 py-2">
                  {new Date(iuran.tanggal_tempo).toLocaleDateString('id-ID')}
                </td>
                <td className="border px-4 py-2">{iuran.kategori?.nama}</td>
                <td className="border px-4 py-2 capitalize">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                      iuran.status === 'aktif'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {iuran.status}
                  </span>
                </td>
                <td className="border px-4 py-2 text-center space-x-2 whitespace-nowrap">
                  <button
                    onClick={() => openModal('edit', iuran.id)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-xs"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => openModal('hapus', iuran.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                  >
                    <Trash size={16} />
                  </button>
                  <button
                    onClick={() => openModal('nonaktif', iuran.id)}
                    disabled={iuran.status === 'nonaktif'}
                    className={`${
                      iuran.status === 'nonaktif'
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-gray-500 hover:bg-gray-600'
                    } text-white px-3 py-1 rounded text-xs`}
                  >
                    <Ban size={16} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-2 text-sm">
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

      {/* Modal Konfirmasi */}
      {modalType && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-10">
          <div className="bg-white shadow-md rounded p-6 w-full max-w-sm border border-gray-300">
            <p className="text-center text-gray-800 text-sm mb-4">
              {modalType === 'hapus' && 'Apakah Anda yakin ingin menghapus data ini?'}
              {modalType === 'nonaktif' && 'Apakah Anda yakin ingin menonaktifkan iuran ini?'}
              {modalType === 'edit' && 'Apakah Anda ingin mengedit data ini?'}
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  if (modalType === 'hapus') handleDelete();
                  if (modalType === 'nonaktif') handleNonaktifkan();
                  if (modalType === 'edit') handleEdit();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                Ya
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 text-sm"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
