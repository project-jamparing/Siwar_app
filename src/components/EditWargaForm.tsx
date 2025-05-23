'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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

export default function EditWargaForm({ nik }: { nik: string }) {
  const router = useRouter();
  const [warga, setWarga] = useState<Warga | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`/api/warga/${nik}`);
      const data = await res.json();
      console.log('DATA WARGA:', data);
      setWarga(data);
      setLoading(false);
    }
    fetchData();
  }, [nik]);  

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!warga) return;

    const res = await fetch(`/api/warga/${warga.nik}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(warga),
    });

    if (res.ok) {
      alert('Data berhasil diperbarui');
      router.push('/dashboard/admin/warga');
    } else {
      const err = await res.json();
      alert('Gagal update: ' + err.message);
    }
  }

  if (loading || !warga) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Edit Warga</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <input
          type="text"
          value={warga.nama}
          onChange={(e) => setWarga({ ...warga, nama: e.target.value })}
          className="border p-2 col-span-2"
          placeholder="Nama"
        />
        <select
          value={warga.jenis_kelamin}
          onChange={(e) => setWarga({ ...warga, jenis_kelamin: e.target.value })}
          className="border p-2"
        >
          <option value="laki-laki">Laki-laki</option>
          <option value="perempuan">Perempuan</option>
        </select>
        {/* ... input lainnya tetap sama ... */}
        <button type="submit" className="col-span-2 bg-blue-600 text-white py-2 rounded">
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}