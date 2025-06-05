'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300 hover:text-black transition-colors duration-200 shadow-sm"
    >
      <ArrowLeft size={18} />
      <span className="font-medium">Kembali</span>
    </button>
  );
}
