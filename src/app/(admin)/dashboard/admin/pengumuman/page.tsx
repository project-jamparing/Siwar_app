import PengumumanViewOnly from '@/components/PengumumanViewOnly';
import prisma from '@/lib/prisma';

export default async function PengumumanPage() {
  const data = await prisma.pengumuman.findMany({
    select: {
      id: true,
      judul: true,
      subjek: true,
      isi: true,
      tanggal: true,
    },
    orderBy: { tanggal: 'desc' },
  });

  return <PengumumanViewOnly data={data} />;
}
    