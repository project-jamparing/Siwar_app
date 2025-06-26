// Path: src/components/Tables/TabelTagihanWarga.tsx
'use client'
import useSWR from 'swr'
import { format } from 'date-fns'
import { id as localeId } from 'date-fns/locale'; // Import locale Bahasa Indonesia
import { useState, useMemo } from 'react'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function TabelTagihanWarga() {
  const { data, error, isLoading } = useSWR('/api/warga/tagihan', fetcher)

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) {
      return [];
    }

    // Sort data here to ensure newest is always on top, before filtering/pagination
    // Assuming 'id' is a good proxy for newest, or if you have a 'createdAt' timestamp in your API response.
    // If you have a 'tanggal_bayar' or 'tanggal_nagih' for each tagihan, use that for sorting instead.
    const sortedData = [...data].sort((a: any, b: any) => b.id - a.id);

    if (!searchTerm) {
      return sortedData;
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return sortedData.filter((item: any) =>
      item.iuran?.nama?.toLowerCase().includes(lowercasedSearchTerm)
    );
  }, [data, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * itemsPerPage;
    const lastPageIndex = firstPageIndex + itemsPerPage;
    return filteredData.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, itemsPerPage, filteredData]);

  // Loading, error, dan no data states yang diperbarui
  if (isLoading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center p-4 font-sans">
        <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Memuat data tagihan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[300px] flex items-center justify-center p-4 font-sans">
        <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-lg">
          <p className="text-lg font-medium text-red-600">
            Error loading data: {error.message || 'Terjadi kesalahan saat mengambil data.'}
          </p>
        </div>
      </div>
    );
  }

  if (data?.error) {
    return (
      <div className="min-h-[300px] flex items-center justify-center p-4 font-sans">
        <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-lg">
          <p className="text-lg font-medium text-red-600">
            Error from API: {data.error || 'Terjadi kesalahan dari server.'}
          </p>
        </div>
      </div>
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="min-h-[300px] flex items-center justify-center p-4 font-sans">
        <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-lg">
          <p className="text-lg font-medium text-red-600">
            Tidak ada data tagihan yang ditemukan.
          </p>
        </div>
      </div>
    );
  }


  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const getPaginationGroup = () => {
    const pages: (number | string)[] = [];
    
    // Logic for smart pagination (similar to RW table)
    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 5) {
        pages.push(...Array.from({ length: 5 }, (_, i) => i + 1), '...');
        pages.push(totalPages - 1, totalPages);
      } else if (currentPage >= totalPages - 4) {
        pages.push(1, 2, '...');
        pages.push(...Array.from({ length: 5 }, (_, i) => totalPages - 4 + i));
      } else {
        pages.push(1, '...');
        pages.push(currentPage - 1, currentPage, currentPage + 1);
        pages.push('...', totalPages);
      }
    }
    return pages;
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen font-sans text-gray-800">
      <div className="max-w-7xl mx-auto"> {/* Main container for the content */}
        <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-900 tracking-tight">
          Tagihan Warga
        </h2>

        {/* Controls: Search and Items per page */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          {/* Search Input */}
          <div className="w-full sm:w-1/2">
            <input
              type="text"
              placeholder="Cari nama iuran..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 bg-gray-50 text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-3 focus:ring-blue-400 focus:border-blue-400 transition duration-200 ease-in-out shadow-sm"
            />
          </div>

          {/* Items Per Page Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="itemsPerPage" className="text-base font-medium text-gray-700">Tampilkan:</label>
            <div className="relative">
              <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 bg-gray-50 text-base text-gray-800 focus:outline-none focus:ring-3 focus:ring-blue-400 focus:border-blue-400 transition duration-200 ease-in-out shadow-sm appearance-none"
              >
                {[5, 10, 20, 50, 100].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl shadow-2xl border border-gray-200 bg-white">
          <table className="w-full table-auto text-base text-gray-700">
            <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <tr>
                <th className="px-5 py-3 text-left font-bold border-b-2 border-blue-800 rounded-tl-xl">Nama Iuran</th>
                <th className="px-5 py-3 text-left font-bold border-b-2 border-blue-800">Nominal</th>
                <th className="px-5 py-3 text-left font-bold border-b-2 border-blue-800">Status</th>
                <th className="px-5 py-3 text-left font-bold border-b-2 border-blue-800">Tanggal Bayar</th>
                <th className="px-5 py-3 text-left font-bold border-b-2 border-blue-800 rounded-tr-xl">Jatuh Tempo</th>
              </tr>
            </thead>
            <tbody>
              {currentTableData.length > 0 ? (
                currentTableData.map((item: any) => (
                  <tr key={item.id} className="border-b border-gray-200 hover:bg-blue-50 transition-colors duration-200 ease-in-out">
                    <td className="px-5 py-3 font-medium text-gray-900">{item.iuran?.nama || '-'}</td>
                    <td className="px-5 py-3 font-semibold text-gray-900">
                      Rp {Number(item.iuran?.nominal || 0).toLocaleString('id-ID')}
                    </td>
                    <td className="px-5 py-3 capitalize">
                      {item.status === 'lunas' ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700 shadow-sm">
                          Sudah Bayar
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700 shadow-sm">
                          Belum Bayar
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {item.tanggal_bayar
                        ? format(new Date(item.tanggal_bayar), 'dd MMMM yyyy', { locale: localeId })
                        : '-'}
                    </td>
                    <td className="px-5 py-3">
                      {item.iuran?.tanggal_tempo
                        ? format(new Date(item.iuran.tanggal_tempo), 'dd MMMM yyyy', { locale: localeId })
                        : '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-red-600 font-medium bg-white">
                    Tidak ada data yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-3">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`px-5 py-2 rounded-lg text-base font-semibold transition duration-200 ease-in-out shadow-md ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-white border border-blue-400 text-blue-700 hover:bg-blue-100 hover:border-blue-500'
              }`}
            >
              Previous
            </button>

            {getPaginationGroup().map((page, index) =>
              typeof page === 'string' ? (
                <span key={`ellipsis-${index}`} className="px-3 py-1 text-gray-500 select-none">...</span>
              ) : (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition duration-150 ease-in-out shadow-md ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400'
                  }`}
                >
                  {page}
                </button>
              )
            )}
            
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`px-5 py-2 rounded-lg text-base font-semibold transition duration-200 ease-in-out shadow-md ${
                currentPage === totalPages || totalPages === 0
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-white border border-blue-400 text-blue-700 hover:bg-blue-100 hover:border-blue-500'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
