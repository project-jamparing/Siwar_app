// app/dashboard/rt/pengumuman/page.tsx
import type { pengumuman as Pengumuman } from '@prisma/client';
import PengumumanComponent from '@/components/Pengumuman';
import { cookies } from 'next/headers';

async function getData(): Promise<Pengumuman[]> {
  const role = 'rt';
  const cookieStore = cookies();
  const nik = cookieStore.get('nik')?.value;

  if (!nik) {
    // Jika nik tidak ada di cookie, return array kosong atau handle error sesuai kebutuhan
    return [];
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/pengumuman?role=${role}&nik=${nik}`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    // Bisa handle error di sini misalnya log atau return []
    return [];
  }

  return res.json();
}

export default async function Page() {
  const data = await getData();

  return <PengumumanComponent data={data} />;
}
