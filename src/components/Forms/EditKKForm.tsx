'use client';

import { useState } from 'react';

type KK = {
  id: string;
  no_kk: string;
  rt_id: string;
  kategori: string;
};

export default function EditKKForm({
  kk,
  onClose,
  onSuccess,
}: {
  kk: KK;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState(kk);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`/api/kk/edit/${kk.no_kk}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });      

    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      alert('Gagal update: ' + data.message);
      return;
    }

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md text-black">
        <h2 className="text-xl font-semibold mb-4">Edit Data KK</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">No KK</label>
            <input
              type="text"
              name="no_kk"
              value={form.no_kk}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">RT</label>
            <select
                name="rt_id"
                value={form.rt_id}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
            >
                <option value="">Pilih RT</option>
                <option value="1">01</option>
                <option value="2">02</option>
                <option value="3">03</option>
                <option value="4">04</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Kategori</label>
            <select
              name="kategori"
              value={form.kategori}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Pilih</option>
              <option value="1">Kampung</option>
              <option value="2">Kost</option>
              <option value="3">Kavling</option>
              <option value="4">UMKM</option>
              <option value="5">Kantor</option>
              <option value="6">Bisnis</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
