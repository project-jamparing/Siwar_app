// src/app/(rw)/dashboard/rw/pengumuman/edit/[id]/page.tsx

'use client';

import EditPengumumanForm from '@/components/Forms/EditPengumumanForm';

export default function EditPengumumanRWPage() {
  return (
    <EditPengumumanForm
      role="rw"
      redirectPath="/dashboard/rw/pengumuman"
      titleColor="text-yellow-700"
      ringColor="focus:ring-yellow-500"
      buttonLabel="Update"
    />
  );
}