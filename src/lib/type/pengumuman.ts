export type Pengumuman = {
  id: number;
  judul: string;
  subjek: string;
  isi: string;
  tanggal: Date;
  rt_id: number;
  rukun_tetangga?: {
    id: number;
    nama: string;
  };
};