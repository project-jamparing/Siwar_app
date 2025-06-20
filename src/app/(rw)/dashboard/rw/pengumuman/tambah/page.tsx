'use client';

import FormTambahPengumuman from '@/components/Forms/FormTambahPengumuman';

export default function TambahPengumumanRWPage() {
  return (
    <FormTambahPengumuman
      role="rw"
      redirectPath="/dashboard/rw/pengumuman"
    />
  );
}
