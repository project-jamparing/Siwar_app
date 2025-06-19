'use client'
import { useRouter } from 'next/navigation'
import FormIuranRT from '@/components/Forms/FormIuranRT'

export default function TambahIuranRTPage() {
  const router = useRouter()

  return (
    <main className="p-1 bg-gray-50 min-h-screen">
      <div className="bg-white shadow rounded p-4 border border-gray-200">
        <FormIuranRT />
      </div>
    </main>
  )
}
