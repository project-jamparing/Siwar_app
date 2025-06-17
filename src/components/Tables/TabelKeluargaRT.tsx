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
  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);

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

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  }, [data, currentPage]);

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-xl shadow-md text-gray-800">
      <h2 className="text-3xl font-bold mb-6">
        📋 Daftar Kepala Keluarga RT {data[0]?.rt?.nama_rt || ''}
      </h2>

      {loading ? (
        <p className="text-center py-6 text-gray-500">Memuat data...</p>
      ) : error ? (
        <p className="text-center py-6 text-red-600">Error: {error}</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-100 text-gray-600 uppercase tracking-wider text-xs font-semibold">
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
                    <td colSpan={4} className="text-center py-6 text-gray-500">
                      Tidak ada data kepala keluarga.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item) => (
                    <tr key={item.nik} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 border-t border-gray-200">
                        {item.no_kk}
                      </td>
                      <td className="px-4 py-3 border-t border-gray-200">
                        {item.nama}
                      </td>
                      <td className="px-4 py-3 border-t border-gray-200 capitalize">
                        {item.kategori}
                      </td>
                      <td className="px-4 py-3 border-t border-gray-200 text-center">
                        <Link
                          href={`/dashboard/rt/keluarga/${item.no_kk}`}
                          title="Lihat Detail"
                          className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition inline-flex items-center justify-center"
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

          {/* Pagination angka + Prev Next */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-4 space-x-2 flex-wrap">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (pageNumber) => (
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
                )
              )}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
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
  );
}