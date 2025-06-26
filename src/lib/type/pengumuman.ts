export type Pengumuman = {
  id: number;
  judul: string;
  subjek: string | null;
  isi: string | null;
  tanggal: Date;
  rt_id: number;
  rukun_tetangga?: {
    id: number;
    nama: string;
  };
};