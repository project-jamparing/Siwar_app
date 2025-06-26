// Path: src/components/Tables/RiwayatPembayaranWargaRW.tsx
'use client'; // WAJIB ada ini karena menggunakan hooks

import { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns'; // Untuk format tanggal

// Definisi interface (tipe data) untuk setiap baris data pembayaran
interface RiwayatPembayaranItem {
  id_pembayaran: number; // ID unik untuk setiap catatan pembayaran (misal: ID transaksi)
  nama_iuran: string; // Nama iuran (contoh: "Iuran Kebersihan", "Iuran Keamanan")
  no_kk: string; // Nomor Kartu Keluarga
  nama_kepala_keluarga: string; // Nama Kepala Keluarga
  status: 'lunas' | 'belum_lunas' | string; // Status pembayaran (sesuaikan jika ada status lain di backend)
  tanggal_bayar: string | null; // Tanggal dan waktu pembayaran, bisa null jika belum lunas
}

export default function RiwayatPembayaranWargaRW() {
  const [data, setData] = useState<RiwayatPembayaranItem[]>([]);
  const [search, setSearch] = useState(''); // State untuk input pencarian
  const [loading, setLoading] = useState(true); // State untuk indikator loading
  const [error, setError] = useState<string | null>(null); // State untuk pesan error

  // useEffect untuk mengambil data saat komponen pertama kali dimuat
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading ke true saat mulai fetch data
      setError(null); // Reset pesan error
      try {
        // --- PENTING: ENDPOINT API INI HARUS ANDA BUAT DI BACKEND ---
        // API ini harus mengembalikan daftar pembayaran dari SEMUA warga di SEMUA RT di bawah RW Anda.
        const res = await axios.get('/api/iuran/status/rw/detail-pembayaran-warga'); // Contoh endpoint
        setData(Array.isArray(res.data) ? res.data : []); // Pastikan res.data adalah array
      } catch (err: any) {
        console.error('❌ Gagal fetch riwayat pembayaran warga (RW):', err);
        if (axios.isAxiosError(err) && err.response) {
          // Menampilkan pesan error dari backend jika ada
          setError(err.response.data.message || err.response.statusText || 'Gagal mengambil data riwayat pembayaran.');
        } else {
          // Menampilkan pesan error umum
          setError('Terjadi kesalahan saat mengambil data riwayat pembayaran.');
        }
        setData([]); // Kosongkan data jika terjadi error
      } finally {
        setLoading(false); // Set loading ke false setelah fetch selesai (baik sukses atau gagal)
      }
    };

    fetchData(); // Panggil fungsi fetchData
  }, []); // Dependency array kosong: fungsi ini hanya akan berjalan sekali saat komponen di-mount

  // Filter data berdasarkan input pencarian (No KK, Nama Kepala Keluarga, atau Nama Iuran)
  const filteredData = data.filter((item) => {
    const searchValue = search.toLowerCase();
    return (
      item.no_kk.toLowerCase().includes(searchValue) ||
      item.nama_kepala_keluarga.toLowerCase().includes(searchValue) ||
      item.nama_iuran.toLowerCase().includes(searchValue)
    );
  });

  // Tampilan saat loading
  if (loading) {
    return <p className="p-4 text-center text-gray-600">Memuat riwayat pembayaran seluruh warga...</p>;
  }

  // Tampilan saat ada error
  if (error) {
    return <p className="p-4 text-center text-red-600">Error: {error}</p>;
  }

  // Tampilan jika tidak ada data sama sekali (setelah loading selesai dan tanpa error)
  if (data.length === 0 && !loading) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Riwayat Pembayaran Warga (RW View)</h2>
        <p className="text-center text-gray-600">Tidak ada data riwayat pembayaran untuk ditampilkan.</p>
      </div>
    );
  }

  // Tampilan utama komponen dengan tabel data
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Riwayat Pembayaran Warga (RW View)</h2>

      {/* Input pencarian */}
      <input
        type="text"
        placeholder="Cari No KK / Nama Kepala Keluarga / Nama Iuran..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 w-full max-w-md"
      />

      {/* Tabel data riwayat pembayaran */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama Iuran
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No KK
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama Kepala Keluarga
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal Bayar
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.length > 0 ? ( // Jika ada data setelah difilter
              filteredData.map((item) => (
                <tr key={item.id_pembayaran}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.nama_iuran}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.no_kk || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.nama_kepala_keluarga || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {item.status === 'lunas' ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Sudah Bayar
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Belum Bayar
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.tanggal_bayar
                      ? format(new Date(item.tanggal_bayar), 'dd-MM-yyyy HH:mm')
                      : '-'}
                  </td>
                </tr>
              ))
            ) : ( // Jika tidak ada data setelah difilter
              <tr>
                <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  Tidak ada data yang cocok dengan pencarian Anda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}