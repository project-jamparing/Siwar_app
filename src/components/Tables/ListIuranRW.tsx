'use client';

import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
dayjs.locale('id');

interface Iuran {
  id: number;
  nama: string;
  deskripsi: string;
  nominal: string;
  tanggal_nagih: string;
  tanggal_tempo: string;
  kategori_id: number;
}

export default function ListIuranRW() {
  const [iuranList, setIuranList] = useState<Iuran[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleNonaktifkan = async (id: number) => {
    const konfirmasi = confirm('Yakin ingin menonaktifkan iuran ini?');
    if (!konfirmasi) return;
  
    try {
      const res = await fetch(`/api/iuran/nonaktifkan/${id}`, {
        method: 'PATCH',
      });
  
      if (!res.ok) throw new Error('Gagal menonaktifkan iuran');
  
      // Hapus dari list agar langsung hilang dari tampilan
      setIuranList((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert('Terjadi kesalahan saat menonaktifkan iuran.');
    }
  };  

  useEffect(() => {
    fetch('/api/iuran/aktif')
      .then((res) => {
        if (!res.ok) throw new Error('Gagal mengambil data iuran');
        return res.json();
      })
      .then((data) => {
        setIuranList(data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <p className="text-center py-8 text-black font-semibold">Memuat iuran...</p>;

  if (error)
    return (
      <p className="text-center py-8 text-red-700 font-semibold bg-red-100 rounded-md max-w-xl mx-auto">
        Error: {error}
      </p>
    );

  if (iuranList.length === 0)
    return (
      <p className="text-center py-8 text-gray-700 font-semibold max-w-xl mx-auto">
        Belum ada iuran
      </p>
    );

  return (
    <div className="max-w-6xl mx-auto mt-10 bg-white rounded-xl shadow-md border border-gray-300 p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Daftar Iuran Bulanan (RW)</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-gray-800 border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-700 text-sm font-semibold">
            <tr>
              <th className="border px-4 py-3 text-left">Nama</th>
              <th className="border px-4 py-3 text-left">Deskripsi</th>
              <th className="border px-4 py-3 text-right">Nominal</th>
              <th className="border px-4 py-3 text-center">Tanggal Tagih</th>
              <th className="border px-4 py-3 text-center">Jatuh Tempo</th>
            </tr>
          </thead>
          <tbody>
          {iuranList.map((iuran) => (
            <tr
              key={iuran.id}
              className="hover:bg-gray-50 transition-all duration-150"
            >
              <td className="border px-4 py-3">{iuran.nama}</td>
              <td className="border px-4 py-3 truncate max-w-xs">{iuran.deskripsi}</td>
              <td className="border px-4 py-3 text-right">
                Rp {parseFloat(iuran.nominal).toLocaleString('id-ID')}
              </td>
              <td className="border px-4 py-3 text-center">
                {dayjs(iuran.tanggal_nagih).format('D MMMM YYYY')}
              </td>
              <td className="border px-4 py-3 text-center">
                {dayjs(iuran.tanggal_tempo).format('D MMMM YYYY')}
              </td>
              <td className="border px-4 py-3 text-center">
                <button
                  onClick={() => handleNonaktifkan(iuran.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                >
                  Nonaktifkan
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  );
}