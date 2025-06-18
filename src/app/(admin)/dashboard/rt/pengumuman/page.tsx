// app/dashboard/rt/pengumuman/page.tsx
import type { pengumuman as Pengumuman } from '@prisma/client';
import PengumumanComponent from '@/components/Pengumuman';
import { cookies } from 'next/headers';

async function getData(): Promise<Pengumuman[]> {
  const role = 'rt';
  const cookieStore = await cookies();
  const nik = cookieStore.get('nik')?.value;

  if (!nik) {
    return [];
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/pengumuman?role=${role}&nik=${nik}`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    return [];
  }

  return res.json();
}

export default async function Page() {
  const data = await getData();

  return <PengumumanComponent data={data} role='rt' />;
}
