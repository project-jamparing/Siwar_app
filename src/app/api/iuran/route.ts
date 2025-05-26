import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "siwar_db",
};

export async function GET() {
  const conn = await mysql.createConnection(dbConfig);
  const [rows] = await conn.execute("SELECT * FROM iuran ORDER BY id DESC");
  await conn.end();

  const formatted = (rows as any[]).map((row) => ({
    id: row.id,
    nama: row.nama,
    nominal: row.nominal,
    tanggalTagih: row.tanggal_tagih,
    tanggalTempo: row.tanggal_tempo,
  }));

  return NextResponse.json(formatted);
}

export async function POST(req: NextRequest) {
  const { nama, nominal, tanggal_tagih, tanggal_tempo } = await req.json();
  if (!nama || !nominal || !tanggal_tagih || !tanggal_tempo) {
    return NextResponse.json({ message: "Data tidak lengkap" }, { status: 400 });
  }

  const conn = await mysql.createConnection(dbConfig);
  await conn.execute(
    `INSERT INTO iuran (nama, nominal, tanggal_tagih, tanggal_tempo) VALUES (?, ?, ?, ?)`,
    [nama, nominal, tanggal_tagih, tanggal_tempo]
  );
  await conn.end();

  return NextResponse.json({ message: "Data berhasil disimpan" });
}

export async function PUT(req: NextRequest) {
  const { id, nama, nominal, tanggal_tagih, tanggal_tempo } = await req.json();
  if (!id || !nama || !nominal || !tanggal_tagih || !tanggal_tempo) {
    return NextResponse.json({ message: "Data tidak lengkap" }, { status: 400 });
  }

  const conn = await mysql.createConnection(dbConfig);
  const [result]: any = await conn.execute(
    `UPDATE iuran SET nama = ?, nominal = ?, tanggal_tagih = ?, tanggal_tempo = ? WHERE id = ?`,
    [nama, nominal, tanggal_tagih, tanggal_tempo, id]
  );
  await conn.end();

  if (result.affectedRows === 0) {
    return NextResponse.json({ message: "Data tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ message: "Data berhasil diupdate" });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ message: "ID diperlukan" }, { status: 400 });

  const conn = await mysql.createConnection(dbConfig);
  const [result]: any = await conn.execute(`DELETE FROM iuran WHERE id = ?`, [id]);
  await conn.end();

  if (result.affectedRows === 0) {
    return NextResponse.json({ message: "Data tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ message: "Data berhasil dihapus" });
}
