'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Eye, Trash, Pencil } from 'lucide-react';
import EditKKForm from '@/components/Forms/EditKKForm';

interface KepalaKeluarga {
  nik: string;
  nama: string;
  no_kk: string;
  rt: string;
  kategori: string;
}

export default function TabelKeluarga() {
  const [data, setData] = useState<KepalaKeluarga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [selectedKK, setSelectedKK] = useState<KepalaKeluarga | null>(null);
  const [refresh, setRefresh] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handleEdit = (kk: KepalaKeluarga) => {
    setSelectedKK(kk);
  };

  const handleSuccess = () => {
    setRefresh((prev) => !prev);
  };

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await fetch('/api/user/profile');
        if (!res.ok) throw new Error('Gagal mengambil role pengguna');
        const json = await res.json();
        setRole(json.role?.toLowerCase() || null);
      } catch (err: any) {
        console.error('Gagal ambil role:', err);
        setRole('rw'); // fallback default
      }
    };

    fetchRole();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/warga/kepala-keluarga');
        if (!res.ok) throw new Error('Gagal mengambil data');
        const json = await res.json();
        setData(json?.length ? json : []);
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refresh]);

  const handleDelete = async (no_kk: string) => {
    const konfirmasi = confirm(`Yakin ingin menghapus KK ${no_kk}?`);
    if (!konfirmasi) return;

    try {
      const res = await fetch('/api/kk/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ no_kk }),
      });

      const json = await res.json();
      if (!res.ok) {
        alert(`Gagal menghapus: ${json.error || 'Terjadi kesalahan'}`);
      } else {
        alert(`✅ ${json.message}`);
        setRefresh((prev) => !prev);
      }
    } catch (err: any) {
      alert(`Gagal: ${err.message}`);
    }
  };

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  }, [data, currentPage]);

  return (
    <>
      {selectedKK && (
        <EditKKForm
          kk={selectedKK}
          onClose={() => setSelectedKK(null)}
          onSuccess={handleSuccess}
        />
      )}

      <div className="p-6 md:p-8 max-w-7xl mx-auto bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          📋 Daftar Kartu Keluarga
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-6 text-gray-500">
            <svg
              className="animate-spin h-6 w-6 mr-2 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            Memuat data...
          </div>
        ) : error ? (
          <p className="text-center py-6 text-red-600 font-medium">⚠️ {error}</p>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full text-sm text-left text-gray-700">
                <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-5 py-3">No KK</th>
                    <th className="px-5 py-3">Nama</th>
                    <th className="px-5 py-3">RT</th>
                    <th className="px-5 py-3">Kategori</th>
                    <th className="px-5 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedData.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-gray-500">
                        Tidak ada data kepala keluarga
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((item) => (
                      <tr key={item.no_kk} className="hover:bg-gray-50 transition">
                        <td className="px-5 py-3 font-medium">{item.no_kk}</td>
                        <td className="px-5 py-3">{item.nama}</td>
                        <td className="px-5 py-3">{item.rt}</td>
                        <td className="px-5 py-3 capitalize">{item.kategori}</td>
                        <td className="px-5 py-3 text-center">
                          <div className="flex justify-center gap-2">
                            <Link
                              href={`/dashboard/${role}/keluarga/${item.no_kk}`}
                              title="Lihat detail"
                              className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                            >
                              <Eye size={16} />
                            </Link>

                            {role === 'rw' && (
                              <>
                                <button
                                  onClick={() => handleEdit(item)}
                                  title="Edit KK"
                                  className="p-2 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 focus:ring-2 focus:ring-yellow-300 focus:outline-none"
                                >
                                  <Pencil size={16} />
                                </button>

                                <button
                                  onClick={() => handleDelete(item.no_kk)}
                                  title="Hapus KK"
                                  className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 focus:ring-2 focus:ring-red-300 focus:outline-none"
                                >
                                  <Trash size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination angka + Prev Next */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-4 space-x-2 flex-wrap">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                >
                  Prev
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((pageNumber) => (
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
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, totalPages)
                    )
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}