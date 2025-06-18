'use client';

import { useEffect, useState } from 'react';
import { Users, FileCheck2, Megaphone } from 'lucide-react';

type Pengumuman = {
  id: number;
  judul: string;
  tanggal: string;
  isi: string;
};

export default function DashboardRTPage() {
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState('');
  const [pengumuman, setPengumuman] = useState<Pengumuman[]>([]);

  const simpanIuran = async () => {
    setIsSending(true);
    setMessage('');
    try {
      const res = await fetch('/api/iuran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: 'Contoh RT',
          nominal: 50000,
          tanggal_tagih: '2025-06-01',
          tanggal_bayar: '2025-06-10',
          tanggal_tempo: '2025-06-30',
        }),
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

  useEffect(() => {
    fetch('/api/pengumuman?role=rt&terbaru=true')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPengumuman(data);
        } else {
          console.error('Format pengumuman salah:', data);
        }
      })
      .catch((err) => console.error('Gagal fetch pengumuman:', err));
  }, []);

  return (
    <main className="flex-1 p-6">
      {/* Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-700">Jumlah Warga RT</h3>
            <Users className="text-indigo-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800">20</p> {/* Ganti sesuai real-time jika sudah pakai API */}
        </div>

        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-700">Total Iuran RT</h3>
            <FileCheck2 className="text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800">Rp 1.250.000</p> {/* Ganti dengan real data nanti */}
        </div>

        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-700">Pengumuman RT</h3>
            <Megaphone className="text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800">{pengumuman.length}</p>
        </div>
      </div>

      {/* Tombol simpan data dummy */}
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

      {/* Pengumuman RT Terbaru */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Pengumuman RT Terbaru</h2>
        {pengumuman.length === 0 ? (
          <p className="text-gray-500">Belum ada pengumuman.</p>
        ) : (
          <div className="space-y-3">
            {pengumuman.map((item) => (
              <div key={item.id} className="p-4 bg-indigo-50 rounded-lg">
                <h3 className="font-semibold text-indigo-700">{item.judul}</h3>
                <p className="text-gray-600 text-sm">{new Date(item.tanggal).toLocaleDateString()}</p>
                <p className="text-gray-700 text-sm mt-1">{item.isi}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
