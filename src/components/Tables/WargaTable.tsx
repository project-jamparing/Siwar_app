'use client';

import { useState, useMemo, useTransition } from 'react';
import { Trash2, Pencil } from 'lucide-react';

type Warga = {
  nik: string;
  nama: string;
  no_kk?: string | null;
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

  const [search, setSearch] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

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

  const sortedAndFilteredWarga = useMemo(() => {
    return warga
      .filter(w =>
        w.nik.toLowerCase().includes(search.toLowerCase()) ||
        w.nama.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        if (a.no_kk === b.no_kk) {
          return a.nama.localeCompare(b.nama);
        }
        return (a.no_kk || '').localeCompare(b.no_kk || '');
      });
  }, [warga, search]);

  const totalPages = Math.ceil(sortedAndFilteredWarga.length / itemsPerPage);

  const paginatedWarga = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedAndFilteredWarga.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedAndFilteredWarga, currentPage, itemsPerPage]);

  return (
    <>
      <div className="flex flex-col space-y-4 mb-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <input
          type="text"
          placeholder="Cari NIK atau Nama..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-3 py-2 rounded-md text-sm w-full md:w-64"
        />

        <div className="flex items-center gap-2">
          <label htmlFor="limit" className="text-sm text-gray-700">
            Tampilkan:
          </label>
          <select
            id="limit"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border px-2 py-1 rounded-md text-sm"
          >
            {[5, 10, 20, 50, 100].map((limit) => (
              <option key={limit} value={limit}>
                {limit}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden border rounded-lg border-gray-300">
            <table className="table-auto min-w-full rounded-xl [&_th]:p-2 [&_td]:p-2">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left text-sm font-semibold text-gray-900 capitalize">No KK</th>
                  <th className="text-left text-sm font-semibold text-gray-900 capitalize">Nama</th>
                  <th className="text-left text-sm font-semibold text-gray-900 capitalize">NIK</th>
                  <th className="text-left text-sm font-semibold text-gray-900 capitalize">Jenis Kelamin</th>
                  <th className="text-left text-sm font-semibold text-gray-900 capitalize">Tempat Lahir</th>
                  <th className="text-left text-sm font-semibold text-gray-900 capitalize">Tanggal Lahir</th>
                  <th className="text-left text-sm font-semibold text-gray-900 capitalize">Agama</th>
                  <th className="text-left text-sm font-semibold text-gray-900 capitalize">Status Kawin</th>
                  <th className="text-left text-sm font-semibold text-gray-900 capitalize">Pekerjaan</th>
                  <th className="text-left text-sm font-semibold text-gray-900 capitalize">Golongan Darah</th>
                  <th className="text-left text-sm font-semibold text-gray-900 capitalize">Kewarganegaraan</th>
                  {showActions && (
                    <th className="text-left text-sm font-semibold text-gray-900 capitalize">Aksi</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {paginatedWarga.map((w) => (
                  <tr key={w.nik} className="bg-white hover:bg-gray-50 transition-all duration-300">
                    <td className="text-sm text-gray-900">{w.no_kk || '-'}</td>
                    <td className="text-sm text-gray-900">{w.nama}</td>
                    <td className="text-sm font-medium text-gray-900">{w.nik}</td>
                    <td className="text-sm text-gray-900">
                      {w.jenis_kelamin === 'perempuan' ? 'Perempuan' : 'Laki-laki'}
                    </td>
                    <td className="text-sm text-gray-900">{w.tempat_lahir || '-'}</td>
                    <td className="text-sm text-gray-900">{formatTanggal(w.tanggal_lahir)}</td>
                    <td className="text-sm text-gray-900">{w.agama || '-'}</td>
                    <td className="text-sm text-gray-900">
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
                    <td className="text-sm text-gray-900">{w.jenis_pekerjaan || '-'}</td>
                    <td className="text-sm text-gray-900">{w.golongan_darah || '-'}</td>
                    <td className="text-sm text-gray-900">{w.kewarganegaraan || '-'}</td>
                    {showActions && (
                      <td className="text-sm text-gray-900 flex gap-2">
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
