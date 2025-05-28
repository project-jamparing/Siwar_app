export type Pengumuman = {
  id: number;
  judul: string;
  isi: string;
  tanggal: Date;
  subjek: string;
  rt_id: number;
  rukun_tetangga?: {
    id: number;
    nama: string;
  };
};