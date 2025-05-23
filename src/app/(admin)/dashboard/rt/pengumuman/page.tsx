// app/dashboard/rt/pengumuman/page.tsx
import { Pengumuman as PengumumanModel } from '@prisma/client';
import Pengumuman from '@/components/Pengumuman';


async function getData(): Promise<Pengumuman[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/pengumuman`, {
    cache: 'no-store',
  });
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <Pengumuman data={data} />;
}
