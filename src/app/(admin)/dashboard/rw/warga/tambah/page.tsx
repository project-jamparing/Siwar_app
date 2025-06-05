// app/dashboard/rw/warga/tambah/page.tsx

'use client';

import FormTambahWarga from '@/components/Forms/FormTambahWarga';

export default function TambahWargaPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tambah Warga</h1>
      <FormTambahWarga />
    </div>
  );
}