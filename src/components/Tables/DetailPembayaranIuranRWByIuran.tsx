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
    return (
      item.no_kk.toLowerCase().includes(searchValue) ||
      item.nama_kepala_keluarga.toLowerCase().includes(searchValue)
    );
  });

  if (loading) {
    return <p className="p-4 text-center text-gray-600">Memuat detail pembayaran per iuran...</p>;
  }

  if (error) {
    return <p className="p-4 text-center text-red-600">Error: {error}</p>;
  }

  if (data.length === 0 && !loading) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Detail Pembayaran Iuran (RW View)</h2>
        <p className="text-center text-gray-600">Tidak ada data pembayaran untuk iuran ini.</p>
      </div>
    );
  }

  // Ambil nama iuran dari data pertama (asumsi semua data untuk iuran yang sama)
  const iuranName = data.length > 0 ? data[0].nama_iuran : `ID Iuran ${iuranId}`;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Detail Pembayaran Iuran: {iuranName}</h2>

      <input
        type="text"
        placeholder="Cari No KK / Nama Kepala Keluarga..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 w-full max-w-md"
      />

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
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
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item.id_pembayaran}>
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
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
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
