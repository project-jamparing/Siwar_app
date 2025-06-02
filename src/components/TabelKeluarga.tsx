'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface KepalaKeluarga {
  nik: string;
  nama: string;
  no_kk: string;
}

export default function TabelKeluarga() {
  const [data, setData] = useState<KepalaKeluarga[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/warga/kepala-keluarga');
        const json = await res.json();

        if (json.error) {
          console.error(json.error);
          return;
        }

        setData(json);
      } catch (error) {
        console.error('Gagal mengambil data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-lg shadow-md text-gray-900">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900">Daftar Kepala Keluarga</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-gray-900">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-900">No KK</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-gray-900">Nama Kepala Keluarga</th>
              <th className="border border-gray-300 px-4 py-2 text-center text-gray-900">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-6 text-gray-500">
                  Tidak ada data kepala keluarga.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.nik} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">{item.no_kk}</td>
                  <td className="border border-gray-300 px-4 py-3">{item.nama}</td>
                  <td className="border border-gray-300 px-4 py-3 text-center">
                    <Link href={`/dashboard/rw/keluarga/${item.no_kk}`}>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">
                        Lihat Detail
                      </button>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}