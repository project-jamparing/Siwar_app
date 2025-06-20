'use client'

import { use } from 'react'
import BackButton from '@/components/Buttons/BackButton'
import DetailPembayaranIuran from '@/components/Tables/DetailPembayaranIuran'

interface Props {
  params: Promise<{ id: string }> // ✅ Promise sesuai App Router Next.js 15
}

export default function DetailIuranPage({ params }: Props) {
  const { id } = use(params) // ✅ Unwrap promise
  const iuranId = parseInt(id)

  if (isNaN(iuranId)) {
    return <p className="p-4 text-red-500">ID iuran tidak valid</p>
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <BackButton />
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Detail Iuran ID: {iuranId}
      </h1>
      <DetailPembayaranIuran iuranId={iuranId} />
    </div>
  )
}
