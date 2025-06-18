// app/(rt)/dashboard/rt/pengumuman/page.tsx
import { cookies } from 'next/headers';
import PengumumanComponent from '@/components/Pengumuman';

export default async function Page() {
  const cookieStore = await cookies(); // ✅ aman di sini
  const nik = cookieStore.get('nik')?.value || '';
  const role = 'rt';

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/pengumuman?role=${role}&nik=${nik}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return <div>Gagal mengambil data pengumuman</div>;
  }

  const data = await res.json();

  return <PengumumanComponent data={data} role={role} />;
}
