// Path: src/components/Tables/DetailPembayaranIuranRWByIuran.tsx
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

// Interface untuk data yang diharapkan dari API detail-pembayaran-warga-rw
interface RiwayatPembayaranItemPerIuran {
  id_pembayaran: number;
  nama_iuran: string;
  no_kk: string;
  nama_kepala_keluarga: string;
  status: 'lunas' | 'belum_lunas' | string;
  tanggal_bayar: string | null;
}

interface DetailPembayaranIuranRWByIuranProps {
  iuranId: number; // ID Iuran yang akan ditampilkan detail pembayarannya
}

export default function DetailPembayaranIuranRWByIuran({ iuranId }: DetailPembayaranIuranRWByIuranProps) {
  const [data, setData] = useState<RiwayatPembayaranItemPerIuran[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Panggil API backend yang baru kita buat
        const res = await axios.get(`/api/iuran/status/rw/${iuranId}/detail-pembayaran-warga`);
        setData(Array.isArray(res.data) ? res.data : []);
      } catch (err: any) {
        console.error('❌ Gagal fetch detail pembayaran warga (RW, per iuran):', err);
        if (axios.isAxiosError(err) && err.response) {
          setError(err.response.data.message || err.response.statusText || 'Gagal mengambil data detail pembayaran.');
        } else {
          setError('Terjadi kesalahan saat mengambil data detail pembayaran.');
        }
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [iuranId]); // Akan fetch ulang jika iuranId berubah

  const filteredData = data.filter((item) => {
    const searchValue = search.toLowerCase();
    // Gunakan optional chaining untuk memastikan properti tidak undefined sebelum toLowerCase
    return (
      (item.no_kk?.toLowerCase() ?? '').includes(searchValue) ||
      (item.nama_kepala_keluarga?.toLowerCase() ?? '').includes(searchValue)
    );
  });

  // Ambil nama iuran dari data pertama (asumsi semua data untuk iuran yang sama)
  const iuranName = data.length > 0 ? data[0].nama_iuran : `ID Iuran ${iuranId}`;

  if (loading) {
    return (
      <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center font-sans">
        <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Memuat detail pembayaran iuran...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center font-sans">
        <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-lg">
          <p className="text-xl font-bold text-red-600 mb-4">Error!</p>
          <p className="text-center text-gray-700">{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen font-sans text-gray-800">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-900 tracking-tight">
          Detail Pembayaran Iuran: <span className="text-blue-700">{iuranName}</span>
        </h2>

        {data.length === 0 && !loading && !error ? (
          <div className="p-8 bg-white rounded-xl shadow-lg text-center text-gray-700">
            <p className="text-lg font-medium">Tidak ada data pembayaran untuk iuran ini.</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex justify-center sm:justify-start">
              <input
                type="text"
                placeholder="Cari No KK / Nama Kepala Keluarga..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-5 py-2.5 border-2 border-gray-300 rounded-lg shadow-sm w-full max-w-md text-base bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-3 focus:ring-blue-400 focus:border-blue-400 transition duration-200 ease-in-out"
              />
            </div>

            <div className="overflow-x-auto rounded-xl shadow-2xl border border-gray-200 bg-white">
              <table className="w-full table-auto text-base text-gray-700">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <tr>
                    <th className="px-5 py-3 text-left font-bold border-b-2 border-blue-800 rounded-tl-xl">
                      No KK
                    </th>
                    <th className="px-5 py-3 text-left font-bold border-b-2 border-blue-800">
                      Nama Kepala Keluarga
                    </th>
                    <th className="px-5 py-3 text-left font-bold border-b-2 border-blue-800">
                      Status
                    </th>
                    <th className="px-5 py-3 text-left font-bold border-b-2 border-blue-800 rounded-tr-xl">
                      Tanggal Bayar
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                      <tr key={item.id_pembayaran} className="hover:bg-blue-50 transition-colors duration-200 ease-in-out">
                        <td className="px-5 py-4 font-medium text-gray-900">
                          {item.no_kk || '-'}
                        </td>
                        <td className="px-5 py-4 font-medium text-gray-900">
                          {item.nama_kepala_keluarga || '-'}
                        </td>
                        <td className="px-5 py-4">
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
                        <td className="px-5 py-4 text-gray-900">
                          {item.tanggal_bayar
                            ? format(new Date(item.tanggal_bayar), 'dd-MM-yyyy HH:mm')
                            : '-'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-red-600 font-medium bg-white">
                        Tidak ada data yang cocok dengan pencarian Anda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
