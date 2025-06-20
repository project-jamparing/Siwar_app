'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

type Pengumuman = {
  id: number;
  judul: string;
  subjek: string;
  isi: string;
  tanggal: Date;
  rt_id: number;
  rukun_tetangga?: {
    id: number;
    nama: string;
  };
};

type Props = {
  data: Pengumuman[];
};

export default function PengumumanViewOnly({ data }: Props) {
  const [selected, setSelected] = useState<Pengumuman | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(6);

  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedId = searchParams.get('selected');

  useEffect(() => {
    if (selectedId) {
      const found = data.find((item) => item.id === Number(selectedId));
      if (found) {
        setSelected(found);
        router.replace('/dashboard/warga/pengumuman', { scroll: false });
      }
    }
  }, [selectedId, data, router]);

  const totalPages = Math.ceil(data.length / limit);

  const currentData = data.slice((currentPage - 1) * limit, currentPage * limit);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1); // reset ke halaman 1 saat limit berubah
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-indigo-100 to-white py-10 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-blue-900 text-center sm:text-left mb-4 sm:mb-0 drop-shadow">
          Daftar Pengumuman
        </h1>
        <div className="flex items-center gap-2 text-gray-600">
          <label htmlFor="limit" className="text-sm text-gray-700">
            Tampilkan:
          </label>
          <select
            id="limit"
            value={limit}
            onChange={handleLimitChange}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            {[3, 6, 9, 12].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {currentData.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelected(item)}
            className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-5 hover:shadow-2xl hover:ring-2 hover:ring-blue-500 transition-all duration-300 cursor-pointer"
          >
            <h2 className="text-lg font-semibold text-blue-800 mb-2">{item.judul}</h2>
            <p className="text-sm text-gray-600 line-clamp-3 mb-3">{item.isi}</p>
            <p className="text-xs text-gray-500 mb-1">
              {new Date(item.tanggal).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            <p className="text-sm text-gray-600">
              {item.rt_id === null
                ? 'Dari: RW'
                : `Dari: RT ${item.rukun_tetangga?.nama || item.rt_id}`}
            </p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-8 space-x-2 text-gray-600">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 disabled:opacity-50"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 border rounded text-sm ${
              page === currentPage
                ? 'bg-blue-500 text-white border-blue-500'
                : 'border-gray-300 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modal View */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full relative max-h-[80vh] overflow-y-auto animate-fade-in">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-4 text-gray-400 hover:text-red-500 text-xl"
              aria-label="Close"
            >
              ✕
            </button>

            <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-2">
              {selected.judul}
            </h2>
            <p className="text-sm italic text-gray-500 mb-3">{selected.subjek}</p>
            <div className="text-gray-700 whitespace-pre-line mb-4">{selected.isi}</div>
            <p className="text-sm text-gray-500">
              {new Date(selected.tanggal).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {selected.rt_id === null
                ? 'Dari: RW'
                : `Dari: RT ${selected.rukun_tetangga?.nama || selected.rt_id}`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}