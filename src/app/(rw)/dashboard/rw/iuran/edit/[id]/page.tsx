'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import BackButton from '@/components/Buttons/BackButton';

export default function EditIuranPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const kategoriOptions = [
    { id: 1, label: 'Semua Warga' },
    { id: 2, label: 'Warga RT 01' },
    { id: 3, label: 'Warga RT 02' },
  ];

  useEffect(() => {
    const fetchIuran = async () => {
      try {
        const res = await axios.get(`/api/iuran/${id}`);
        const data = res.data;
        setForm({
          ...data,
          nominal: data.nominal.toString(),
        });
      } catch {
        console.error('Gagal mengambil data iuran');
      } finally {
        setLoading(false);
      }
    };
    fetchIuran();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'nominal') {
      const raw = value.replace(/\./g, '').replace(/[^0-9]/g, '');
      setForm({ ...form, nominal: raw });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.put(`/api/iuran/${id}`, {
        ...form,
        nominal: parseFloat(form.nominal),
        kategori_id: parseInt(form.kategori_id),
        tanggal_nagih: new Date(form.tanggal_nagih),
        tanggal_tempo: new Date(form.tanggal_tempo),
      });

      router.push('/dashboard/rw/iuran');
    } catch (error) {
      console.error('Gagal update iuran.', error);
    }
  };

  if (loading || !form) return <p className="p-4 text-center">Loading...</p>;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 border border-gray-300 rounded-lg shadow-sm bg-white max-w-lg mx-auto text-gray-700"
    >
      <h2 className="text-xl font-bold mb-4 text-center">Edit Iuran</h2>

      <BackButton />

      <div>
        <label className="block text-sm font-medium mb-1">Nama:</label>
        <input
          type="text"
          name="nama"
          value={form.nama}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 w-full"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Deskripsi:</label>
        <textarea
          name="deskripsi"
          value={form.deskripsi}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 w-full"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Nominal:</label>
        <input
          type="text"
          name="nominal"
          inputMode="numeric"
          value={form.nominal ? Number(form.nominal).toLocaleString('id-ID') : ''}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 w-full"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tanggal Nagih:</label>
        <input
          type="date"
          name="tanggal_nagih"
          value={form.tanggal_nagih?.split('T')[0]}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 w-full"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tanggal Tempo:</label>
        <input
          type="date"
          name="tanggal_tempo"
          value={form.tanggal_tempo?.split('T')[0]}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 w-full"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Kategori:</label>
        <select
          name="kategori_id"
          value={form.kategori_id}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 w-full bg-white"
          required
        >
          <option value="" disabled>
            Pilih kategori...
          </option>
          {kategoriOptions.map((kategori) => (
            <option key={kategori.id} value={kategori.id}>
              {kategori.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white font-semibold px-6 py-2 rounded hover:bg-blue-600 transition"
      >
        Simpan
      </button>
    </form>
  );
}
