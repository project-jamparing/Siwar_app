'use client';

import FormTambahPengumuman from '@/components/Forms/FormTambahPengumuman';

export default function TambahPengumumanRTPage() {
  return (
    <FormTambahPengumuman
      role="rt"
      redirectPath="/dashboard/rt/pengumuman"
      fetchRtId={true}
    />
  );
}
