// src/app/(rt)/dashboard/rt/pengumuman/edit/[id]/page.tsx

'use client';

import EditPengumumanForm from '@/components/Forms/EditPengumumanForm';

export default function EditPengumumanRTPage() {
  return (
    <EditPengumumanForm
      role="rt"
      redirectPath="/dashboard/rt/pengumuman"
      titleColor="text-blue-800"
      ringColor="focus:ring-blue-500"
      buttonLabel="Simpan"
    />
  );
}
