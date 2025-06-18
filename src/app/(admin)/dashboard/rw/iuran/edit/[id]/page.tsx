'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

export default function EditIuranPage() {
  const { id } = useParams();
  const router = useRouter();
  const [iuran, setIuran] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIuran = async () => {
      try {
        const res = await axios.get(`/api/iuran/${id}`);
        setIuran(res.data);
      } catch (error) {
        alert('Gagal memuat data iuran');
      } finally {
        setLoading(false);
      }
    };
    fetchIuran();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setIuran({ ...iuran, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`/api/iuran/${id}`, {
        ...iuran,
        nominal: parseFloat(iuran.nominal),
      });
      alert('Iuran berhasil diupdate');
      router.push('/dashboard/rw/iuran');
    } catch (error) {
      alert('Gagal mengupdate iuran');
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-4 text-gray-900">
      <h1 className="text-xl font-bold mb-4">Edit Iuran</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Nama</label>
          <input
            name="nama"
            value={iuran.nama}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Deskripsi</label>
          <textarea
            name="deskripsi"
            value={iuran.deskripsi}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Nominal</label>
          <input
            name="nominal"
            value={iuran.nominal}
            onChange={handleChange}
            type="number"
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Tanggal Nagih</label>
          <input
            name="tanggal_nagih"
            type="date"
            value={iuran.tanggal_nagih?.split('T')[0]}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Tanggal Tempo</label>
          <input
            name="tanggal_tempo"
            type="date"
            value={iuran.tanggal_tempo?.split('T')[0]}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}
