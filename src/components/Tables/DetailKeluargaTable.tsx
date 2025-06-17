interface DetailKeluargaTableProps {
  anggotaKeluarga: {
    nik: string;
    nama: string;
    jenis_kelamin: string;
    tempat_lahir: string;
    tanggal_lahir: string | null;
    agama: string;
    pendidikan: string;
    jenis_pekerjaan: string;
    golongan_darah: string;
    status_perkawinan: string;
    tanggal_perkawinan: string | null;
    status_hubungan_dalam_keluarga: string;
    kewarganegaraan: string;
    no_paspor: string;
    no_kitap: string;
    ayah: string;
    ibu: string;
  }[];
}

export default function DetailKeluargaTable({ anggotaKeluarga }: DetailKeluargaTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-300 rounded-md text-sm text-gray-900 [&_th]:px-2 [&_th]:py-1 [&_td]:px-2 [&_td]:py-1">
        <thead className="bg-gray-200">
          <tr>
            <th className="border">NIK</th>
            <th className="border">Nama</th>
            <th className="border">Jenis Kelamin</th>
            <th className="border">Tempat Lahir</th>
            <th className="border">Tanggal Lahir</th>
            <th className="border">Agama</th>
            <th className="border">Pendidikan</th>
            <th className="border">Pekerjaan</th>
            <th className="border">Gol. Darah</th>
            <th className="border">Status Perkawinan</th>
            <th className="border">Tgl. Perkawinan</th>
            <th className="border">Status Hubungan</th>
            <th className="border">Kewarganegaraan</th>
            <th className="border">No Paspor</th>
            <th className="border">No KITAP</th>
            <th className="border">Nama Ayah</th>
            <th className="border">Nama Ibu</th>
          </tr>
        </thead>
        <tbody>
          {anggotaKeluarga.map((anggota) => (
            <tr key={anggota.nik} className="hover:bg-gray-100">
              <td className="border">{anggota.nik}</td>
              <td className="border">{anggota.nama}</td>
              <td className="border">
                {anggota.jenis_kelamin === 'perempuan' ? 'Perempuan' : 'Laki-laki'}
              </td>
              <td className="border">{anggota.tempat_lahir}</td>
              <td className="border">
                {anggota.tanggal_lahir
                  ? new Date(anggota.tanggal_lahir).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })
                  : '-'}
              </td>
              <td className="border">{anggota.agama}</td>
              <td className="border">{anggota.pendidikan}</td>
              <td className="border">{anggota.jenis_pekerjaan}</td>
              <td className="border">
                {anggota.golongan_darah === 'O'
                  ? 'O'
                  : anggota.golongan_darah === 'A'
                  ? 'A'
                  : anggota.golongan_darah === 'B'
                  ? 'B'
                  : anggota.golongan_darah === 'AB'
                  ? 'AB'
                  : anggota.golongan_darah === 'NULL'
                  ? 'Tidak diketahui'
                  : '-'}
              </td>
              <td className="border">
                {anggota.status_perkawinan === 'kawin_tercatat'
                  ? 'Kawin'
                  : anggota.status_perkawinan === 'belum_kawin'
                  ? 'Belum Kawin'
                  : anggota.status_perkawinan === 'cerai_hidup'
                  ? 'Cerai Hidup'
                  : anggota.status_perkawinan === 'cerai_mati'
                  ? 'Cerai Mati'
                  : '-'}
              </td>
              <td className="border">
                {anggota.tanggal_perkawinan
                  ? new Date(anggota.tanggal_perkawinan).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })
                  : '-'}
              </td>
              <td className="border">{anggota.status_hubungan_dalam_keluarga}</td>
              <td className="border">{anggota.kewarganegaraan}</td>
              <td className="border">{anggota.no_paspor || '-'}</td>
              <td className="border">{anggota.no_kitap || '-'}</td>
              <td className="border">{anggota.ayah}</td>
              <td className="border">{anggota.ibu}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}