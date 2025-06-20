'use client'

import BackButton from '@/components/Buttons/BackButton'
import DetailPembayaranIuran from '@/components/Tables/DetailPembayaranIuran'

interface Props {
  params: { id: string }
}

export default function DetailIuranPage({ params }: Props) {
  const iuranId = parseInt(params.id)

  if (isNaN(iuranId)) {
    return <p className="p-4 text-red-500">ID iuran tidak valid</p>
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <BackButton />
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Detail Iuran ID: {iuranId}</h1>
      <DetailPembayaranIuran iuranId={iuranId} />
    </div>
  )
}
