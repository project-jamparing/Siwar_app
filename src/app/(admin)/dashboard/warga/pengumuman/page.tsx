import PengumumanViewOnly from '@/components/PengumumanViewOnly';
import { cookies } from 'next/headers';
import { Pengumuman } from '@/lib/type/pengumuman';

export default async function PengumumanPage() {
  const cookieStore = cookies();
  const nik = cookieStore.get('nik')?.value;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/pengumuman?role=warga&nik=${nik}`, {
    cache: 'no-store',
  });

  const data: Pengumuman[] = await res.json();

  return <PengumumanViewOnly data={data} />;
}
