'use client'
import { useRouter } from 'next/navigation'
import FormIuranRT from '@/components/Forms/FormIuranRT'

export default function TambahIuranRTPage() {
  const router = useRouter()

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Tambah Iuran RT</h1>
        <button
          onClick={() => router.back()}
          className="text-sm px-3 py-1 border rounded text-gray-700 hover:bg-gray-100"
        >
          ← Kembali
        </button>
      </div>

      <div className="bg-white shadow rounded p-4 border border-gray-200">
        <FormIuranRT />
      </div>
    </main>
  )
}
