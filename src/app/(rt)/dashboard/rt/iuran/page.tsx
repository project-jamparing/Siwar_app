'use client'
import Link from 'next/link'
import TabelIuranRT from '@/components/Tables/TabelIuranRT'

export default function PageRT() {
  return (
    <main className="p-2 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Daftar Iuran RT
        </h1>
        <Link
          href="/dashboard/rt/iuran/tambah"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
        >
          + Tambah Iuran
        </Link>
      </div>

      <div className="bg-white shadow rounded p-4 border border-gray-200">
        <TabelIuranRT />
      </div>
    </main>
  )
}
