import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id)

  if (isNaN(id)) {
    return NextResponse.json(
      { success: false, message: 'ID iuran tidak valid.' },
      { status: 400 }
    )
  }

  try {
    const updatedIuran = await prisma.iuran.update({
      where: { id },
      data: {
        status: 'nonaktif',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Iuran berhasil dinonaktifkan.',
      data: updatedIuran,
    })
  } catch (error) {
    console.error('Gagal menonaktifkan iuran:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal menonaktifkan iuran.' },
      { status: 500 }
    )
  }
}
