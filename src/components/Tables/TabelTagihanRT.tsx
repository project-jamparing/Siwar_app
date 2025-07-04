// src/components/Tables/TabelIuranRT.tsx
// ATAU src/components/Tables/TabelTagihanRT.tsx (gunakan nama file yang Anda miliki)
'use client' // Pastikan ini ada, karena ini komponen client-side

import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
// Hapus import useSession jika Anda tidak lagi menggunakannya di frontend ini
// import { useSession } from 'next-auth/react'; 

interface TagihanRT {
  id: number;
  nama_iuran: string;
  no_kk: string;
  nama_kepala_keluarga: string;
  status: 'lunas' | 'belum_lunas'; // Tetap gunakan enum dari Prisma
  tanggal_bayar: string | null;
  iuran_id: number;
}

export default function TabelIuranRT() { // Sesuaikan nama function jika TabelTagihanRT
  // Jika Anda tidak mengambil rt_id dari sesi di frontend ini,
  // maka baris ini bisa dihapus atau dikomentari.
  // const { data: session } = useSession(); 
  const [tagihan, setTagihan] = useState<TagihanRT[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  // Fungsi fetchTagihan sekarang TIDAK lagi menerima parameter rtId
  // karena API Anda mengambil rt_id dari cookie.
  const fetchTagihan = async () => {
    try {
      // PENTING: Pastikan URL ini benar-benar sesuai dengan lokasi API Anda.
      // Jika API Anda ada di src/app/api/iuran/rt/route.ts, maka URL-nya adalah '/api/iuran/rt'.
      // Jika API Anda ada di src/app/api/tagihan/rt/route.ts, maka URL-nya adalah '/api/tagihan/rt'.
      const res = await fetch('/api/iuran/rt'); // <<< Cek URL ini!

      if (!res.ok) { // Tambahkan pengecekan jika response tidak OK (misal: 401, 500)
        const errorData = await res.json();
        console.error("Failed to fetch tagihan from API:", errorData.message || res.statusText);
        setTagihan([]);
        // Opsional: tampilkan pesan error ke user
        alert(`Gagal memuat data iuran: ${errorData.message || 'Server error.'}`);
        return;
      }

      const data = await res.json();
      if (data.success) {
        setTagihan(data.data);
      } else {
        console.error("API response indicates failure:", data.message);
        setTagihan([]);
      }
    } catch (error) {
      console.error("Error fetching tagihan:", error);
      // Ini adalah error 'Failed to fetch' yang Anda dapatkan.
      // Bisa jadi masalah jaringan, atau server API tidak merespons.
      setTagihan([]);
      alert("Terjadi kesalahan saat mengambil data iuran. Pastikan server berjalan dan koneksi internet stabil.");
    }
  };

  const handleConfirm = async () => {
    if (!selectedId) return;

    try {
      const res = await fetch(`/api/tagihan/${selectedId}/bayar`, { method: 'PATCH' });
      const data = await res.json();

      if (data.success) {
        setSelectedId(null);
        // Setelah konfirmasi berhasil, panggil ulang fetchTagihan
        fetchTagihan(); 
      } else {
        console.error("Failed to confirm payment:", data.message);
        alert(`Gagal mengonfirmasi pembayaran: ${data.message}`);
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
      alert("Terjadi kesalahan saat mengonfirmasi pembayaran.");
    }
  };

  // useEffect ini akan memanggil fetchTagihan saat komponen dimuat
  useEffect(() => {
    fetchTagihan(); // Panggil fungsi tanpa parameter rtId
  }, []); // Empty dependency array, hanya dijalankan sekali saat mount

  // --- Bagian filterData, pagination, renderPageNumbers, dan JSX rendering di bawah ini tidak berubah ---
  const filteredData = tagihan.filter((t) =>
    t.no_kk.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.nama_kepala_keluarga.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];

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

    return pages.map((page, index) =>
      typeof page === 'string' ? (
        <span key={`ellipsis-${index}`} className="px-3 py-1 text-gray-500 select-none">...</span>
      ) : (
        <button
          key={page}
          onClick={() => goToPage(page)}
          className={`px-3 py-1 rounded-md transition-all duration-150 text-sm font-medium ${
            currentPage === page
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white border border-gray-300 hover:bg-gray-100 text-gray-700'
          }`}
        >
          {page}
        </button>
      )
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Controls */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4 text-gray-800">
        <div className="flex items-center gap-2">
          <label htmlFor="tampilan" className="text-sm font-medium text-gray-700">
            Tampilan:
          </label>
          <select
            id="tampilan"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            {[5, 10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Cari No KK / Nama..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md shadow-sm border border-gray-200 bg-white">
        <table className="w-full table-auto text-sm text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left border-b">Nama Iuran</th>
              <th className="px-4 py-2 text-left border-b">No KK</th>
              <th className="px-4 py-2 text-left border-b">Kepala Keluarga</th>
              <th className="px-4 py-2 text-left border-b">Status</th>
              <th className="px-4 py-2 text-center border-b">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((t: TagihanRT) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{t.nama_iuran}</td>
                  <td className="px-4 py-2 border-b">{t.no_kk}</td>
                  <td className="px-4 py-2 border-b">{t.nama_kepala_keluarga}</td>
                  <td className="px-4 py-2 border-b font-semibold">
                    {/* Sesuaikan dengan nilai string yang Anda format di API: 'belum bayar' / 'sudah bayar' */}
                    {t.status === 'belum bayar' ? ( // Perhatikan perbandingan string di sini
                      <span className="text-red-600">Belum Bayar</span>
                    ) : (
                      <span className="text-green-600">Sudah Bayar</span>
                    )}
                  </td>
                  <td className="px-4 py-2 border-b text-center">
                    {/* Sesuaikan dengan nilai string yang Anda format di API: 'belum bayar' */}
                    {t.status === 'belum bayar' && ( // Perhatikan perbandingan string di sini
                      <button
                        onClick={() => setSelectedId(t.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md shadow-sm transition"
                      >
                        <Check size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-6 text-red-600 font-medium">
                  Tidak ada data tagihan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md text-sm transition ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white border border-gray-300 hover:bg-gray-100'
            }`}
          >
            Prev
          </button>

          {renderPageNumbers()}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md text-sm transition ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white border border-gray-300 hover:bg-gray-100'
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* Modal Konfirmasi */}
      {selectedId && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-sm text-center">
            <p className="mb-4 text-gray-700 font-medium">
              Apakah Anda yakin warga ini telah membayar?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirm}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
              >
                Ya
              </button>
              <button
                onClick={() => setSelectedId(null)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition"
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