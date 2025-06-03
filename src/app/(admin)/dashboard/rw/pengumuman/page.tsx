// app/dashboard/rw/pengumuman/page.tsx
import type { pengumuman as Pengumuman } from '@prisma/client';
import PengumumanComponent from '@/components/Pengumuman';

async function getData(): Promise<Pengumuman[]> {
  const role = 'rw';
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/pengumuman?role=${role}`, {
    cache: 'no-store',
  });
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <PengumumanComponent data={data} />;
}
