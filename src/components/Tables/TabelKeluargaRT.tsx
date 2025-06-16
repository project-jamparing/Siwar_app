'use client';

import { useEffect, useState } from 'react';
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
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [rt_id]);

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
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100 text-left text-gray-600 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-4 py-3">No KK</th>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500">
                    Tidak ada data kepala keluarga.
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.nik} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 border-t border-gray-200">{item.no_kk}</td>
                    <td className="px-4 py-3 border-t border-gray-200">{item.nama}</td>
                    <td className="px-4 py-3 border-t border-gray-200 capitalize">{item.kategori}</td>
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
      )}
    </div>
  );
}