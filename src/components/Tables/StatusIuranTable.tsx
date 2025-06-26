// src/components/StatusIuranTable.tsx

'use client'

import { useEffect, useState } from 'react'

interface StatusIuran {
  id: number
  nama: string
  total: number
  sudah: number
  belum: number
}

export default function StatusIuranTable() {
  const [list, setList] = useState<StatusIuran[]>([])

  useEffect(() => {
    fetch('/api/iuran/status/rw')
      .then((res) => res.json())
      .then((data) => {
        console.log('DATA STATUS IURAN RW:', data) // ⬅️ Tambahkan ini
        setList(data)
      })
  }, [])
  

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-8">
      <h2 className="text-xl font-semibold mb-4">Status Pembayaran Iuran Bulanan</h2>
      <table className="w-full border text-sm text-black">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Nama Iuran</th>
            <th className="border px-4 py-2 text-center">Total</th>
            <th className="border px-4 py-2 text-center text-green-700">Sudah Bayar</th>
            <th className="border px-4 py-2 text-center text-red-700">Belum Bayar</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item) => (
            <tr key={item.id}>
              <td className="border px-4 py-2">{item.nama}</td>
              <td className="border px-4 py-2 text-center">{item.total}</td>
              <td className="border px-4 py-2 text-center text-green-700">{item.sudah}</td>
              <td className="border px-4 py-2 text-center text-red-700">{item.belum}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
