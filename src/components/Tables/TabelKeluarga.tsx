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
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchKK, setSearchKK] = useState('');

  const [filterRT, setFilterRT] = useState('Semua');
  const [filterKategori, setFilterKategori] = useState('Semua');

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

  const mapKategori = (kategori: string) => {
    switch (kategori) {
      case '1': return 'Kampung';
      case '2': return 'Kost';
      case '3': return 'Kavling';
      case '4': return 'UMKM';
      case '5': return 'Kantor';
      case '6': return 'Bisnis';
      default: return kategori;
    }
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchKK = item.no_kk.toLowerCase().includes(searchKK.toLowerCase());
      const matchRT = filterRT === 'Semua' || item.rt === filterRT;
      const matchKategori = filterKategori === 'Semua' || mapKategori(item.kategori) === filterKategori;
      return matchKK && matchRT && matchKategori;
    });
  }, [data, searchKK, filterRT, filterKategori]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const handleEdit = (kk: KepalaKeluarga) => {
    setSelectedKK(kk);
  };

  const handleSuccess = () => {
    setRefresh((prev) => !prev);
  };

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

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3 text-gray-800">
          <input
            type="text"
            placeholder="Cari No KK..."
            value={searchKK}
            onChange={(e) => {
              setSearchKK(e.target.value);
              setCurrentPage(1);
            }}
            className="border px-3 py-2 rounded-md text-sm w-full md:w-64"
          />

          <div className="flex flex-wrap gap-2">
            <div>
              <label htmlFor="filterRT" className="text-sm text-gray-700">RT:</label>
              <select
                id="filterRT"
                value={filterRT}
                onChange={(e) => {
                  setFilterRT(e.target.value);
                  setCurrentPage(1);
                }}
                className="border px-2 py-1 rounded-md text-sm ml-2"
              >
                {['Semua', '01', '02', '03', '04'].map((rt) => (
                  <option key={rt} value={rt}>{rt}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="limit" className="text-sm text-gray-700">Tampilkan:</label>
              <select
                id="limit"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border px-2 py-1 rounded-md text-sm ml-2"
              >
                {[5, 10, 20, 50, 100].map((limit) => (
                  <option key={limit} value={limit}>{limit}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-6 text-gray-600">
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
            <div className="overflow-x-auto rounded-lg border border-gray-300">
              <table className="min-w-full text-sm text-left text-gray-800">
                <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
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
                      <td colSpan={5} className="text-center py-6 text-gray-600 font-medium">
                        Tidak ada data kepala keluarga
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((item) => (
                      <tr key={item.no_kk} className="hover:bg-gray-50 transition">
                        <td className="px-5 py-3 font-medium">{item.no_kk}</td>
                        <td className="px-5 py-3">{item.nama}</td>
                        <td className="px-5 py-3">{item.rt}</td>
                        <td className="px-5 py-3 capitalize">{mapKategori(item.kategori)}</td>
                        <td className="px-5 py-3 text-center">
                          <div className="flex justify-center gap-2">
                            <Link
                              href={`/dashboard/${role}/keluarga/${item.no_kk}`}
                              title="Lihat detail"
                              className="p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                            >
                              <Eye size={16} />
                            </Link>

                            {role === 'rw' && (
                              <>
                                <button
                                  onClick={() => handleEdit(item)}
                                  title="Edit KK"
                                  className="p-2 rounded-full bg-yellow-100 text-yellow-700 hover:bg-yellow-200 focus:ring-2 focus:ring-yellow-300 focus:outline-none"
                                >
                                  <Pencil size={16} />
                                </button>

                                <button
                                  onClick={() => handleDelete(item.no_kk)}
                                  title="Hapus KK"
                                  className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 focus:ring-2 focus:ring-red-300 focus:outline-none"
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

            {totalPages > 1 && (
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
            )}
          </>
        )}
      </div>
    </>
  );
}
