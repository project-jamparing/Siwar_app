import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id)

  if (isNaN(id)) {
    return NextResponse.json({ success: false, message: 'ID tidak valid' }, { status: 400 })
  }

  try {
    const updated = await prisma.iuran.update({
      where: { id },
      data: {
        status: 'nonaktif',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Iuran berhasil dinonaktifkan',
      data: updated,
    })
  } catch (error) {
    console.error('❌ Gagal nonaktifkan iuran:', error)
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat menonaktifkan iuran' },
      { status: 500 }
    )
  }
}
