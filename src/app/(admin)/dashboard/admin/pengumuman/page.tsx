import Pengumuman from '@/components/Pengumuman';
import prisma from '@/lib/prisma';

export default async function PengumumanPage() {
  const data = await prisma.pengumuman.findMany({
    select: {
      id: true,
      tanggal: true,
      judul: true,
      subjek: true,
      isi: true,
    },
    orderBy: { tanggal: 'desc' },
  });

  const formattedData = data.map((item) => ({
    ...item,
    tanggal: item.tanggal.toISOString().slice(0, 10),
  }));

  return <Pengumuman data={formattedData} />;
}
