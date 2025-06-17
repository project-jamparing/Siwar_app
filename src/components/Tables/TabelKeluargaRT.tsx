'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Eye } from 'lucide-react';

interface KepalaKeluarga {
  nik: string;
  nama: string;
  no_kk: string;
  kategori: string;
  rt: {
    nama_rt: string;
  };
}

export default function TabelKeluargaRT({ rt_id }: { rt_id: number }) {
  const [data, setData] = useState<KepalaKeluarga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchKK, setSearchKK] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/warga/kepala-keluarga?rt_id=${rt_id}`);
        if (!res.ok) throw new Error('Gagal mengambil data');
        const json = await res.json();

        if (json.error) {
          setError(json.error);
          setData([]);
          return;
        }

        setData(json);
        setCurrentPage(1); // reset ke halaman 1 kalau ganti rt_id
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [rt_id]);

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      item.no_kk.toLowerCase().includes(searchKK.toLowerCase())
    );
  }, [data, searchKK]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-xl shadow-md text-gray-800">
      <h2 className="text-3xl font-bold mb-6">
        📋 Daftar Kepala Keluarga RT {data[0]?.rt?.nama_rt || ''}
      </h2>

      {/* Search + Limit */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
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
            <table className="w-full text-sm text-left text-gray-800">
              <thead className="bg-gray-100 text-gray-700 uppercase tracking-wider text-xs font-semibold">
                <tr>
                  <th className="px-4 py-3">No KK</th>
                  <th className="px-4 py-3">Nama</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-gray-600 font-medium">
                      Tidak ada data kepala keluarga.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item) => (
                    <tr key={item.nik} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 border-t border-gray-200">{item.no_kk}</td>
                      <td className="px-4 py-3 border-t border-gray-200">{item.nama}</td>
                      <td className="px-4 py-3 border-t border-gray-200 capitalize">{item.kategori}</td>
                      <td className="px-4 py-3 border-t border-gray-200 text-center">
                        <Link
                          href={`/dashboard/rt/keluarga/${item.no_kk}`}
                          title="Lihat Detail"
                          className="p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-2 focus:ring-blue-300 inline-flex items-center justify-center transition"
                        >
                          <Eye size={16} />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
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
  );
}