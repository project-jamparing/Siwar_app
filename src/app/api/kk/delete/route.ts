// DELETE /api/kk/delete/route.ts
import  prisma  from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function DELETE(req: Request) {
  try {
    const { no_kk } = await req.json()

    if (!no_kk) {
      return NextResponse.json({ error: 'No KK wajib diisi' }, { status: 400 })
    }

    // 1. Ambil semua warga dari no_kk ini
    const wargaList = await prisma.warga.findMany({
      where: { no_kk },
      select: { nik: true },
    })

    const nikList = wargaList.map(w => w.nik)

    // 2. Cek dulu siapa yang jadi kepala keluarga
    const kkData = await prisma.kk.findUnique({
      where: { no_kk },
      select: { nik: true },
    })

    const nikKepala = kkData?.nik

    // 3. Update KK: set nik = null biar gak ngeblok penghapusan kepala keluarga
    if (nikKepala) {
      await prisma.kk.update({
        where: { no_kk },
        data: { nik: null },
      })
    }

    // 4. Hapus semua user yang terhubung
    await prisma.user.deleteMany({
      where: {
        nik: { in: nikList },
      },
    })

    // 5. Hapus semua warga
    await prisma.warga.deleteMany({
      where: { no_kk },
    })

    // 6. Hapus KK
    await prisma.kk.delete({
      where: { no_kk },
    })

    return NextResponse.json({ message: 'KK dan semua anggota berhasil dihapus' })
  } catch (err) {
    console.error('Error deleting KK:', err)
    return NextResponse.json({ error: 'Gagal menghapus KK' }, { status: 500 })
  }
}