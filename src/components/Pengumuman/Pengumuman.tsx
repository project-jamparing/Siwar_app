'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import CardPengumuman from '@/components/Pengumuman/CardPengumuman';
import type { Pengumuman } from '@/lib/type/pengumuman';
import { Plus } from 'lucide-react';

type Props = {
  data: Pengumuman[];
  role: 'rt' | 'rw';
};

export default function Pengumuman({ data: initialData, role }: Props) {
  const [data, setData] = useState<Pengumuman[]>(initialData);
  const [selected, setSelected] = useState<Pengumuman | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [pengumumanToDelete, setPengumumanToDelete] = useState<Pengumuman | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  const searchParams = useSearchParams();
  const router = useRouter();

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/pengumuman?page=${currentPage}&limit=${perPage}&role=${role}`);
      const json = await res.json();
      setData(json.data);
      setTotalPages(Math.ceil(json.total / perPage));

      const selectedId = searchParams.get('selected');
      if (selectedId) {
        const found = json.data.find((item: Pengumuman) => item.id === Number(selectedId));
        if (found) {
          setSelected(found);
        } else {
          try {
            const detailRes = await fetch(`/api/pengumuman/${selectedId}`);
            const detailJson = await detailRes.json();
            if (detailJson?.data) setSelected(detailJson.data);
          } catch (err) {
            console.error('Gagal fetch pengumuman by ID:', err);
          }
        }
      }
    } catch (err) {
      console.error('Gagal ambil data:', err);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, perPage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 text-gray-900 py-10 px-4 sm:px-6">
      
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-10 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-3xl font-extrabold text-gray-800">
              📢 Daftar Pengumuman
            </h1>
            <Link href={`/dashboard/${role}/pengumuman/tambah`}>
              <button className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-xl shadow transition-all duration-200 w-full sm:w-auto">
                <Plus size={18} />
                Tambah Pengumuman
              </button>
            </Link>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span>Tampilkan:</span>
            <select
              className="px-3 py-1.5 bg-white border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring focus:ring-sky-400"
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={3}>3</option>
              <option value={6}>6</option>
              <option value={9}>9</option>
            </select>
          </div>
        </div>
      {/* Grid daftar pengumuman */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {data.map((item) => (
          <CardPengumuman
            key={item.id}
            item={item}
            role={role}
            onDelete={() => {
              setShowConfirmDelete(true);
              setPengumumanToDelete(item);
            }}
            onClick={setSelected}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-10 max-w-7xl mx-auto">
        <ul className="inline-flex items-center -space-x-px text-sm">
          <li>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 ml-0 leading-tight text-gray-600 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 disabled:opacity-50"
            >
              Prev
            </button>
          </li>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <li key={page}>
              <button
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 leading-tight border ${
                  currentPage === page
                    ? 'bg-sky-500 text-white border-sky-500'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            </li>
          ))}

          <li>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 leading-tight text-gray-600 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </li>
        </ul>
      </div>

      {/* Modal detail pengumuman */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl max-w-md w-full relative max-h-[80vh] overflow-y-auto animate-fade-in border border-gray-200">
            <button
              onClick={() => {
                setSelected(null);
                router.replace(`/dashboard/${role}/pengumuman`, { scroll: false });
              }}
              className="absolute top-3 right-4 text-gray-400 hover:text-red-500 text-xl transition"
              aria-label="Tutup"
            >
              ✕
            </button>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              {selected.judul}
            </h2>
            {selected.subjek && (
              <p className="text-sm text-sky-600 italic mb-3">{selected.subjek}</p>
            )}
            <p className="text-gray-700 whitespace-pre-line leading-relaxed mb-4">
              {selected.isi || '-'}
            </p>
            <p className="text-sm text-gray-500 text-right">
              {selected.tanggal
                ? new Date(selected.tanggal).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'Tanggal tidak tersedia'}
            </p>
          </div>
        </div>
      )}

      {/* Modal konfirmasi hapus */}
      {showConfirmDelete && pengumumanToDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-2xl max-w-sm w-full shadow-xl animate-fade-in border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Yakin ingin menghapus pengumuman ini?
            </h3>
            <p className="text-sm text-red-500 mb-6">
              {pengumumanToDelete.judul}
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 text-sm rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
                onClick={() => {
                  setShowConfirmDelete(false);
                  setPengumumanToDelete(null);
                }}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700"
                onClick={async () => {
                  try {
                    const res = await fetch(`/api/pengumuman/${pengumumanToDelete.id}`, {
                      method: 'DELETE',
                    });
                    if (!res.ok) throw new Error('Gagal hapus');
                    setData(data.filter(item => item.id !== pengumumanToDelete.id));
                    setShowConfirmDelete(false);
                    setPengumumanToDelete(null);
                  } catch (err) {
                    console.error(err);
                  }
                }}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
