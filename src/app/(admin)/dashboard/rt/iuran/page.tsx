'use client';
import React, { useState } from 'react';

const Iuran = () => {
  const [formData, setFormData] = useState({
    nama: '',
    nominal: '',
    tanggalTagih: '',
    tanggalBayar: '',
    tanggalTempo: '',
  });

  const [dataIuran, setDataIuran] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/iuran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: formData.nama,
          nominal: Number(formData.nominal),
          tanggal_tagih: formData.tanggalTagih,
          tanggal_bayar: formData.tanggalBayar || null,
          tanggal_tempo: formData.tanggalTempo,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        // Update data di frontend
        setDataIuran([...dataIuran, formData]);

        // Reset form
        setFormData({
          nama: '',
          nominal: '',
          tanggalTagih: '',
          tanggalBayar: '',
          tanggalTempo: '',
        });

        alert('Data berhasil disimpan');
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Terjadi kesalahan saat mengirim data');
    }
  };

  return (
    <div className="p-6 bg-white text-black rounded shadow-md max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Data Iuran Warga</h1>

      {/* Form Input */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="block font-semibold mb-1">Nama</label>
          <input
            type="text"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Nominal</label>
          <input
            type="number"
            name="nominal"
            value={formData.nominal}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Tanggal Tagih</label>
          <input
            type="date"
            name="tanggalTagih"
            value={formData.tanggalTagih}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Tanggal Bayar</label>
          <input
            type="date"
            name="tanggalBayar"
            value={formData.tanggalBayar}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Tanggal Tempo</label>
          <input
            type="date"
            name="tanggalTempo"
            value={formData.tanggalTempo}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Simpan
        </button>
      </form>

      {/* Tabel Data */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 border">No</th>
              <th className="px-4 py-2 border">Nama</th>
              <th className="px-4 py-2 border">Nominal</th>
              <th className="px-4 py-2 border">Tagih</th>
              <th className="px-4 py-2 border">Bayar</th>
              <th className="px-4 py-2 border">Tempo</th>
            </tr>
          </thead>
          <tbody>
            {dataIuran.map((item, index) => (
              <tr key={index} className="bg-white">
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border">{item.nama}</td>
                <td className="px-4 py-2 border">Rp{parseInt(item.nominal).toLocaleString()}</td>
                <td className="px-4 py-2 border">{item.tanggalTagih}</td>
                <td className="px-4 py-2 border">{item.tanggalBayar || '-'}</td>
                <td className="px-4 py-2 border">{item.tanggalTempo}</td>
              </tr>
            ))}
            {dataIuran.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center px-4 py-4 border text-gray-500">
                  Belum ada data iuran
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Iuran;
