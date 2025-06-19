import { cookies } from 'next/headers';
import PengumumanComponent from '@/components/Pengumuman';
import type { pengumuman as Pengumuman } from '@prisma/client';

export const dynamic = 'force-dynamic';

export default async function Page() {
const cookieStore = await cookies();
const nik = cookieStore.get('nik')?.value;


  if (!nik) {
    return <div className="p-4 text-red-500">Cookie nik tidak ditemukan.</div>;
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/pengumuman?role=rt&nik=${nik}&terbaru=true`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    return <div className="p-4 text-red-500">Gagal fetch data pengumuman.</div>;
  }

  const data: Pengumuman[] = await res.json();

  return <PengumumanComponent data={data} role="rt" />;
}
