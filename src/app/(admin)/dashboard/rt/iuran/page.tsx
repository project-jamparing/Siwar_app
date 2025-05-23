'use client';
import React, { useState, useEffect } from 'react';

type FormData = {
  id?: number;
  nama: string;
  nominal: string;
  tanggalTagih: string;
  tanggalTempo: string;
};

const formatTanggal = (isoDate: string) => {
  if (!isoDate) return '-';
  const date = new Date(isoDate);
  const year = date.getFullYear().toString().slice(2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const toInputDate = (isoDate: string) => {
  if (!isoDate) return '';
  return new Date(isoDate).toISOString().slice(0, 10);
};

const Iuran = () => {
  const [formData, setFormData] = useState<FormData>({
    nama: '',
    nominal: '',
    tanggalTagih: '',
    tanggalTempo: '',
  });

  const [dataIuran, setDataIuran] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/iuran');
        const data = await res.json();
        setDataIuran(data);
      } catch (err) {
        console.error('Gagal fetch data:', err);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing && editId !== null) {
      try {
        const res = await fetch('/api/iuran', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editId,
            nama: formData.nama,
            nominal: Number(formData.nominal),
            tanggalTagih: formData.tanggalTagih,
            tanggalTempo: formData.tanggalTempo,
          }),
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message);

        const updated = await fetch('/api/iuran');
        const newData = await updated.json();
        setDataIuran(newData);

        alert('Data berhasil diubah');
      } catch (err) {
        console.error('Edit error:', err);
        alert('Gagal mengubah data');
      }

      setIsEditing(false);
      setEditId(null);
    } else {
      try {
        const res = await fetch('/api/iuran', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nama: formData.nama,
            nominal: Number(formData.nominal),
            tanggal_tagih: formData.tanggalTagih,
            tanggal_tempo: formData.tanggalTempo,
          }),
        });

        const result = await res.json();

        if (res.ok) {
          const updated = await fetch('/api/iuran');
          const newData = await updated.json();
          setDataIuran(newData);
          alert('Data berhasil disimpan');
        } else {
          alert('Error: ' + result.message);
        }
      } catch (error) {
        console.error('Fetch error:', error);
        alert('Terjadi kesalahan saat mengirim data');
      }
    }

    setFormData({
      nama: '',
      nominal: '',
      tanggalTagih: '',
      tanggalTempo: '',
    });
  };

  const handleEdit = (item: any) => {
    setFormData({
      id: item.id,
      nama: item.nama,
      nominal: item.nominal.toString(),
      tanggalTagih: toInputDate(item.tanggalTagih),
      tanggalTempo: toInputDate(item.tanggalTempo),
    });
    setEditId(item.id ?? null);
    setIsEditing(true);
  };

  const handleDelete = (id?: number) => {
    if (!id) return;
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/iuran?id=${deleteId}`, {
        method: 'DELETE',
      });

      const result = await res.json();

      if (res.ok) {
        const updated = await fetch('/api/iuran');
        const newData = await updated.json();
        setDataIuran(newData);
        alert('Data berhasil dihapus');
      } else {
        alert('Gagal hapus: ' + result.message);
      }
    } catch (error) {
      console.error('Hapus error:', error);
      alert('Terjadi kesalahan saat menghapus data');
    } finally {
      setShowConfirm(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="p-6 bg-white text-black rounded shadow-md max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Data Iuran Warga</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        {['nama', 'nominal', 'tanggalTagih', 'tanggalTempo'].map((field) => (
          <div key={field}>
            <label className="block font-semibold mb-1 capitalize">
              {field.replace('tanggal', 'Tanggal ')}
            </label>
            <input
              type={field === 'nominal' ? 'number' : field.startsWith('tanggal') ? 'date' : 'text'}
              name={field}
              value={(formData as any)[field]}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
        ))}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {isEditing ? 'Update' : 'Simpan'}
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 border">No</th>
              <th className="px-4 py-2 border">Nama</th>
              <th className="px-4 py-2 border">Nominal</th>
              <th className="px-4 py-2 border">Tagih</th>
              <th className="px-4 py-2 border">Tempo</th>
              <th className="px-4 py-2 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dataIuran.map((item, index) => (
              <tr key={index} className="bg-white">
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border">{item.nama}</td>
                <td className="px-4 py-2 border">Rp{parseInt(item.nominal).toLocaleString()}</td>
                <td className="px-4 py-2 border">{formatTanggal(item.tanggalTagih)}</td>
                <td className="px-4 py-2 border">{formatTanggal(item.tanggalTempo)}</td>
                <td className="px-4 py-2 border text-center space-x-2">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDelete(item.id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {dataIuran.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center px-4 py-4 border text-gray-500">
                  Belum ada data iuran
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center border">
            <h2 className="text-lg font-bold mb-4">Konfirmasi Hapus</h2>
            <p className="mb-6">Apakah Anda yakin ingin menghapus data ini?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Hapus
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Iuran;
