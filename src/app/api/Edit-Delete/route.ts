import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "siwar_db",
};

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
      nama,
      nominal,
      tanggalNagih,
      tanggalTempo,
      deskripsi,
      kategori_id,
      status,
    } = body;

    if (
      !id ||
      !nama?.trim() ||
      isNaN(nominal) ||
      !tanggalNagih ||
      !tanggalTempo ||
      !deskripsi?.trim() ||
      isNaN(kategori_id) ||
      !status?.trim()
    ) {
      return NextResponse.json({ message: 'Data tidak lengkap' }, { status: 400 });
    }

    const conn = await mysql.createConnection(dbConfig);
    const [result]: any = await conn.execute(
      `UPDATE iuran 
       SET nama = ?, nominal = ?, tanggal_nagih = ?, tanggal_tempo = ?, deskripsi = ?, kategori_id = ?, status = ?
       WHERE id = ?`,
      [nama, nominal, tanggalNagih, tanggalTempo, deskripsi, kategori_id, status, id]
    );
    await conn.end();

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "Data tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ message: "Data berhasil diupdate" });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ message: "Terjadi kesalahan saat mengupdate", error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

    if (!id || isNaN(id)) {
      return NextResponse.json({ message: "ID tidak valid" }, { status: 400 });
    }

    const conn = await mysql.createConnection(dbConfig);
    const [result]: any = await conn.execute(`DELETE FROM iuran WHERE id = ?`, [id]);
    await conn.end();

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "Data tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ message: "Data berhasil dihapus" });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ message: "Terjadi kesalahan saat menghapus", error }, { status: 500 });
  }
}
