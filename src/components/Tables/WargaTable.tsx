'use client';

import { useState, useTransition, useMemo } from 'react';
import { Trash2, Pencil } from 'lucide-react';

type Warga = {
  nik: string;
  nama: string;
  jenis_kelamin: string;
  tempat_lahir?: string | null;
  tanggal_lahir?: string | null;
  agama?: string | null;
  status_perkawinan?: string | null;
  jenis_pekerjaan?: string | null;
  golongan_darah?: string | null;
  kewarganegaraan?: string | null;
};

export default function WargaTable({
  warga,
  showActions = true,
}: {
  warga: Warga[];
  showActions?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNik, setSelectedNik] = useState<string | null>(null);
  const [selectedNama, setSelectedNama] = useState<string | null>(null);

  const handleDelete = (nik: string, nama: string) => {
    setSelectedNik(nik);
    setSelectedNama(nama);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedNik) return;
    startTransition(async () => {
      try {
        const res = await fetch(`/api/warga/${selectedNik}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          window.location.reload();
        } else {
          const err = await res.json();
          alert('Gagal hapus: ' + err.message);
        }
      } catch (error) {
        alert('Terjadi kesalahan saat menghapus');
      } finally {
        setShowDeleteModal(false);
      }
    });
  };

  const formatTanggal = (tanggal: string | null | undefined) => {
    if (!tanggal) return '-';
    const date = new Date(tanggal);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  // --- Pagination ---
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(warga.length / itemsPerPage);

  const paginatedWarga = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return warga.slice(startIndex, startIndex + itemsPerPage);
  }, [warga, currentPage]);

  return (
    <>
      <div className="flex flex-col">
        <div className="overflow-x-auto pb-4">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden border rounded-lg border-gray-300">
              <table className="table-auto min-w-full rounded-xl">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-5 text-left text-sm font-semibold text-gray-900 capitalize">NIK</th>
                    <th className="p-5 text-left text-sm font-semibold text-gray-900 capitalize">Nama</th>
                    <th className="p-5 text-left text-sm font-semibold text-gray-900 capitalize">Jenis Kelamin</th>
                    <th className="p-5 text-left text-sm font-semibold text-gray-900 capitalize">Tempat Lahir</th>
                    <th className="p-5 text-left text-sm font-semibold text-gray-900 capitalize">Tanggal Lahir</th>
                    <th className="p-5 text-left text-sm font-semibold text-gray-900 capitalize">Agama</th>
                    <th className="p-5 text-left text-sm font-semibold text-gray-900 capitalize">Status Kawin</th>
                    <th className="p-5 text-left text-sm font-semibold text-gray-900 capitalize">Pekerjaan</th>
                    <th className="p-5 text-left text-sm font-semibold text-gray-900 capitalize">Golongan Darah</th>
                    <th className="p-5 text-left text-sm font-semibold text-gray-900 capitalize">Kewarganegaraan</th>
                    {showActions && (
                      <th className="p-5 text-left text-sm font-semibold text-gray-900 capitalize">Aksi</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                  {paginatedWarga.map((w) => (
                    <tr key={w.nik} className="bg-white hover:bg-gray-50 transition-all duration-300">
                      <td className="p-5 text-sm font-medium text-gray-900">{w.nik}</td>
                      <td className="p-5 text-sm text-gray-900">{w.nama}</td>
                      <td className="p-5 text-sm text-gray-900">
                        {w.jenis_kelamin === 'perempuan' ? 'Perempuan' : 'Laki-laki'}
                      </td>
                      <td className="p-5 text-sm text-gray-900">{w.tempat_lahir || '-'}</td>
                      <td className="p-5 text-sm text-gray-900">{formatTanggal(w.tanggal_lahir)}</td>
                      <td className="p-5 text-sm text-gray-900">{w.agama || '-'}</td>
                      <td className="p-5 text-sm text-gray-900">
                        {w.status_perkawinan === 'kawin_tercatat'
                          ? 'Kawin'
                          : w.status_perkawinan === 'belum_kawin'
                          ? 'Belum Kawin'
                          : w.status_perkawinan === 'cerai_hidup'
                          ? 'Cerai Hidup'
                          : w.status_perkawinan === 'cerai_mati'
                          ? 'Cerai Mati'
                          : '-'}
                      </td>
                      <td className="p-5 text-sm text-gray-900">{w.jenis_pekerjaan || '-'}</td>
                      <td className="p-5 text-sm text-gray-900">{w.golongan_darah || '-'}</td>
                      <td className="p-5 text-sm text-gray-900">{w.kewarganegaraan || '-'}</td>
                      {showActions && (
                        <td className="p-5 text-sm text-gray-900 flex gap-2">
                          <a
                            href={`/dashboard/rw/warga/edit/${w.nik}`}
                            className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </a>
                          <button
                            onClick={() => handleDelete(w.nik, w.nama)}
                            className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
                            title="Hapus"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination angka + Prev Next */}
            <div className="flex justify-center items-center mt-4 space-x-2 flex-wrap">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`px-3 py-1 rounded ${
                    currentPage === pageNumber
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Hapus */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-md w-[90%]">
            <h2 className="text-xl font-bold mb-2 text-gray-800">Konfirmasi Hapus</h2>
            <p className="text-gray-600 mb-4">
              Yakin ingin menghapus data{' '}
              <span className="font-semibold text-red-500">{selectedNama}</span>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}