'use client';

import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { Users, FileCheck2, Megaphone } from 'lucide-react';

export default function RWPage() {
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState('');

  const simpanIuran = async () => {
    setIsSending(true);
    setMessage('');
    try {
      const res = await fetch('/api/iuran', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nama: 'Faris cukurukuk',
          nominal: 100000,
          tanggal_tagih: '2025-05-01',
          tanggal_bayar: '2025-05-21',
          tanggal_tempo: '2025-05-31'
        })
      });

      const data = await res.json();
      setMessage(data.message || 'Respon tidak dikenal');
    } catch (err) {
      console.error(err);
      setMessage('Terjadi kesalahan saat kirim data');
    } finally {
      setIsSending(false);
    }
  };

  const warga = await prisma.warga.findMany();

  return (
    <main className="flex-1 p-6">
      {/* Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-700">Jumlah Warga</h3>
            <Users className="text-indigo-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800">{warga.length}</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-700">Total Iuran RW</h3>
            <FileCheck2 className="text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800">Rp 6.500.000</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-700">Pengumuman RW</h3>
            <Megaphone className="text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800">4</p>
        </div>
      </div>

      {/* Tombol simpan data */}
      <div className="mb-6">
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400"
          onClick={simpanIuran}
          disabled={isSending}
        >
          {isSending ? 'Menyimpan...' : 'Simpan Iuran Contoh'}
        </button>
        {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
      </div>

      {/* Pengumuman */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Pengumuman RW Terbaru</h2>
        <div className="space-y-3">
          <div className="p-4 bg-indigo-50 rounded-lg">
            <h3 className="font-semibold text-indigo-700">Musyawarah Warga RW</h3>
            <p className="text-gray-600 text-sm">Sabtu, 20.00 WIB di Aula RW</p>
          </div>
          <div className="p-4 bg-indigo-50 rounded-lg">
            <h3 className="font-semibold text-indigo-700">Gotong Royong Mingguan</h3>
            <p className="text-gray-600 text-sm">Minggu, 06.00 pagi – lingkungan RW</p>
          </div>
        </div>
      </div>
    </main>
  );
}