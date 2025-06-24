'use client'
import useSWR from 'swr'
import { format } from 'date-fns'
import { useState, useMemo } from 'react'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function TabelTagihanWarga() {
  // PENTING: Semua Hooks harus dipanggil di bagian PALING ATAS komponen,
  // sebelum ada logika conditional rendering (if isLoading, if error, dll.)

  // 1. Panggil useSWR terlebih dahulu
  const { data, error, isLoading } = useSWR('/api/warga/tagihan', fetcher)

  // 2. Panggil semua Hooks useState
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default 10 item per halaman
  const [currentPage, setCurrentPage] = useState(1); // Default halaman 1
  const [searchTerm, setSearchTerm] = useState(''); // State untuk query pencarian

  // 3. Lakukan logika filtering dan pagination dengan useMemo.
  //    Pastikan ini juga di atas conditional return.
  //    Kita harus berhati-hati karena 'data' bisa undefined/null di awal.

  const filteredData = useMemo(() => {
    // Pastikan data ada sebelum melakukan filter
    if (!Array.isArray(data)) {
      return []; // Mengembalikan array kosong jika data belum siap
    }

    if (!searchTerm) {
      return data;
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return data.filter((item: any) =>
      // Tambahkan pengecekan null/undefined untuk item.iuran dan item.iuran.nama
      item.iuran?.nama?.toLowerCase().includes(lowercasedSearchTerm)
    );
  }, [data, searchTerm]); // Dependency array penting di sini

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * itemsPerPage;
    const lastPageIndex = firstPageIndex + itemsPerPage;
    return filteredData.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, itemsPerPage, filteredData]); // Dependency array diupdate


  // Setelah semua Hooks dipanggil, baru kita bisa melakukan pengecekan kondisi loading/error
  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error loading data: {error.message}</p>; // Tampilkan pesan error jika ada
  // Tambahan penanganan error dari API (jika ada data.error)
  if (data?.error) return <p>Error from API: {data.error}</p>;
  if (!Array.isArray(data) || data.length === 0) return <p>Tidak ada data tagihan.</p>; // Ubah kondisi ini


  // Fungsi navigasi pagination
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
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    // Menyesuaikan rentang jika terlalu dekat dengan batas
    if (end - start + 1 < 5) {
      if (currentPage - 2 < 1) {
        end = Math.min(totalPages, end + (1 - (currentPage - 2)));
      } else if (currentPage + 2 > totalPages) {
        start = Math.max(1, start - ((currentPage + 2) - totalPages));
      }
    }

    const pages = [];
    // Pastikan totalPages tidak nol jika tidak ada data
    if (totalPages > 0) {
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  // Handler saat search term berubah
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset halaman ke 1 setiap kali search term berubah
  };

  return (
    <div className="overflow-x-auto text-gray-900">
      {/* Judul ini tetap ada di TabelTagihanWarga atau dipindahkan ke TagihanPage */}
      {/* Jika sudah ada di TagihanPage, bagian ini bisa dihapus dari sini */}
      {/* <h2 className="text-xl font-semibold mb-4 text-center">Tagihan Warga</h2> */}

      {/* Kontrol di atas tabel: Search dan Dropdown "Tampilkan" */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
        {/* Input Search */}
        <div className="w-full md:w-1/3">
          <input
            type="text"
            placeholder="Cari nama iuran..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Dropdown "Tampilkan" di kanan */}
        <div className="flex justify-end w-full md:w-auto">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Tampilkan</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1); // Reset ke halaman pertama setiap kali ganti jumlah item
              }}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

      <table className="min-w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-2 border">Nama Iuran</th>
            <th className="px-4 py-2 border">Nominal</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Tanggal Bayar</th>
            <th className="px-4 py-2 border">Jatuh Tempo</th>
          </tr>
        </thead>
        <tbody>
          {currentTableData.length > 0 ? (
            currentTableData.map((item: any) => (
              <tr key={item.id}>
                <td className="px-4 py-2 border">{item.iuran?.nama || '-'}</td>
                <td className="px-4 py-2 border">
                  Rp {Number(item.iuran?.nominal || 0).toLocaleString()}
                </td>
                <td className="px-4 py-2 border capitalize">
                  {item.status || '-'}
                </td>
                <td className="px-4 py-2 border">
                  {item.tanggal_bayar
                    ? format(new Date(item.tanggal_bayar), 'dd-MM-yyyy')
                    : '-'}
                </td>
                <td className="px-4 py-2 border">
                  {item.iuran?.tanggal_tempo
                    ? format(new Date(item.iuran.tanggal_tempo), 'dd-MM-yyyy')
                    : '-'}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-4 py-2 text-center text-gray-500">
                Tidak ada data yang ditemukan.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination di bawah tabel dan di tengah, tanpa teks "Menampilkan X dari Y data" */}
      <div className="flex justify-center mt-4"> {/* Cukup justify-center dan tanpa flex-col serta space-y */}
        <nav className="flex space-x-1" aria-label="Pagination">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Prev
          </button>
          {getPaginationGroup().map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`px-3 py-1 border rounded-md text-sm ${
                currentPage === page
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  )
}