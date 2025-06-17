'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg 
        bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900
        dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 dark:hover:text-white
        transition-all duration-200 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
    >
      <ArrowLeft size={18} className="shrink-0" />
      <span>Kembali</span>
    </button>
  );
}
