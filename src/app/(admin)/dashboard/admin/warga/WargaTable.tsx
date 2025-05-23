'use client';
import { useState, useTransition } from 'react';
import { Trash2, Pencil } from 'lucide-react';

type Warga = {
  nik: string;
  nama: string;
  jenis_kelamin: string;
  tempat_lahir?: string | null;
  tanggal_lahir?: string | null;
  agama?: string | null;
  status_perkawinan?: string | null;
  jenis_pekerjaan?: string | null;
  golongan_darah?: string | null;
  kewarganegaraan?: string | null;
};

export default function WargaTable({ warga }: { warga: Warga[] }) {
  const [isPending, startTransition] = useTransition();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNik, setSelectedNik] = useState<string | null>(null);
  const [selectedNama, setSelectedNama] = useState<string | null>(null);

  function handleDelete(nik: string, nama: string) {
    setSelectedNik(nik);
    setSelectedNama(nama);
    setShowDeleteModal(true);
  }

  async function confirmDelete() {
    if (!selectedNik) return;

    startTransition(async () => {
      try {
        const res = await fetch(`/api/warga/${selectedNik}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          window.location.reload();
        } else {
          const err = await res.json();
          alert('Gagal hapus: ' + err.message);
        }
      } catch (error) {
        console.error(error);
        alert('Terjadi kesalahan saat menghapus');
      } finally {
        setShowDeleteModal(false);
      }
    });
  }

  const formatTanggal = (tanggal: string | null | undefined) => {
    if (!tanggal) return '-';
    const date = new Date(tanggal);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full overflow-hidden rounded-md border border-gray-300 shadow">
          <table className="min-w-full text-sm text-left bg-white">
            <thead className="bg-blue-100 text-gray-800">
              <tr>
                <th className="border px-4 py-2">NIK</th>
                <th className="border px-4 py-2">Nama</th>
                <th className="border px-4 py-2">Jenis Kelamin</th>
                <th className="border px-4 py-2">Tempat Lahir</th>
                <th className="border px-4 py-2">Tanggal Lahir</th>
                <th className="border px-4 py-2">Agama</th>
                <th className="border px-4 py-2">Status Kawin</th>
                <th className="border px-4 py-2">Pekerjaan</th>
                <th className="border px-4 py-2">Golongan Darah</th>
                <th className="border px-4 py-2">Kewarganegaraan</th>
                <th className="border px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {warga.map((w) => (
                <tr key={w.nik} className="hover:bg-yellow-50 transition-colors">
                  <td className="border px-4 py-2">{w.nik}</td>
                  <td className="border px-4 py-2">{w.nama}</td>
                  <td className="border px-4 py-2">
                    {w.jenis_kelamin === 'perempuan' ? 'Perempuan' : 'Laki-laki'}
                  </td>
                  <td className="border px-4 py-2">{w.tempat_lahir || '-'}</td>
                  <td className="border px-4 py-2">{formatTanggal(w.tanggal_lahir)}</td>
                  <td className="border px-4 py-2">{w.agama || '-'}</td>
                  <td className="border px-4 py-2">
                    {w.status_perkawinan === 'kawin_tercatat'
                      ? 'Kawin'
                      : w.status_perkawinan === 'belum_kawin'
                      ? 'Belum Kawin'
                      : '-'}
                  </td>
                  <td className="border px-4 py-2">{w.jenis_pekerjaan || '-'}</td>
                  <td className="border px-4 py-2">{w.golongan_darah || '-'}</td>
                  <td className="border px-4 py-2">{w.kewarganegaraan || '-'}</td>
                  <td className="border px-4 py-2 space-x-2">
                    <a
                      href={`/dashboard/admin/warga/edit/${w.nik}`}
                      className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                    >
                      Edit
                    </a>
                    <button
                      onClick={() => handleDelete(w.nik, w.nama)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Konfirmasi Hapus */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl w-[90%] max-w-md animate-fade-in text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Konfirmasi Hapus</h2>
            <p className="text-sm text-gray-600 mb-6">
              Apakah kamu yakin ingin menghapus data warga{' '}
              <span className="font-semibold text-red-500">{selectedNama}</span>?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-100 transition"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
              >
                Yakin
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}