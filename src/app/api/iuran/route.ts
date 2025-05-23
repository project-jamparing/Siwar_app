import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "siwar_db",
};

// GET: Ambil semua data iuran
export async function GET() {
  try {
    const conn = await mysql.createConnection(dbConfig);
    const [rows] = await conn.execute("SELECT * FROM iuran ORDER BY id DESC");
    await conn.end();

    const formatted = (rows as any[]).map(row => ({
      id: row.id,
      nama: row.nama,
      nominal: row.nominal,
      tanggalTagih: row.tanggal_tagih,
      tanggalTempo: row.tanggal_tempo,
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("Error ambil data iuran:", err);
    return NextResponse.json(
      { status: "error", message: "Server error saat ambil data" },
      { status: 500 }
    );
  }
}

// POST: Tambah data iuran
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nama, nominal, tanggal_tagih, tanggal_tempo } = body;

    if (!nama || !nominal || !tanggal_tagih || !tanggal_tempo) {
      return NextResponse.json(
        { status: "error", message: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    const conn = await mysql.createConnection(dbConfig);
    const query = `
      INSERT INTO iuran (nama, nominal, tanggal_tagih, tanggal_tempo)
      VALUES (?, ?, ?, ?)
    `;

    await conn.execute(query, [
      nama,
      nominal,
      tanggal_tagih,
      tanggal_tempo,
    ]);

    await conn.end();

    return NextResponse.json({ status: "success", message: "Data berhasil disimpan" });
  } catch (err) {
    console.error("Error simpan data iuran:", err);
    return NextResponse.json(
      { status: "error", message: "Server error" },
      { status: 500 }
    );
  }
}

// PUT: Update data iuran berdasarkan id
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, nama, nominal, tanggalTagih, tanggalTempo } = body;

    if (!id || !nama || !nominal || !tanggalTagih || !tanggalTempo) {
      return NextResponse.json(
        { status: "error", message: "Data tidak lengkap untuk update" },
        { status: 400 }
      );
    }

    const conn = await mysql.createConnection(dbConfig);
    const query = `
      UPDATE iuran 
      SET nama = ?, nominal = ?, tanggal_tagih = ?, tanggal_tempo = ?
      WHERE id = ?
    `;

    const [result]: any = await conn.execute(query, [
      nama,
      nominal,
      tanggalTagih,
      tanggalTempo,
      id,
    ]);

    await conn.end();

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { status: "error", message: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ status: "success", message: "Data berhasil diubah" });
  } catch (err) {
    console.error("Error update data iuran:", err);
    return NextResponse.json(
      { status: "error", message: "Server error saat update" },
      { status: 500 }
    );
  }
}

// DELETE: Hapus data iuran berdasarkan id
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { status: "error", message: "ID tidak ditemukan" },
        { status: 400 }
      );
    }

    const conn = await mysql.createConnection(dbConfig);
    const [result]: any = await conn.execute("DELETE FROM iuran WHERE id = ?", [id]);
    await conn.end();

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { status: "error", message: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ status: "success", message: "Data berhasil dihapus" });
  } catch (err) {
    console.error("Error hapus data iuran:", err);
    return NextResponse.json(
      { status: "error", message: "Server error saat menghapus data" },
      { status: 500 }
    );
  }
}
