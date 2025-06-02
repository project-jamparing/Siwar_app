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
      <table className="w-full border border-gray-300 rounded-md text-sm text-gray-900">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">NIK</th>
            <th className="border p-2">Nama</th>
            <th className="border p-2">Jenis Kelamin</th>
            <th className="border p-2">Tempat Lahir</th>
            <th className="border p-2">Tanggal Lahir</th>
            <th className="border p-2">Agama</th>
            <th className="border p-2">Pendidikan</th>
            <th className="border p-2">Pekerjaan</th>
            <th className="border p-2">Gol. Darah</th>
            <th className="border p-2">Status Perkawinan</th>
            <th className="border p-2">Tgl. Perkawinan</th>
            <th className="border p-2">Status Hubungan</th>
            <th className="border p-2">Kewarganegaraan</th>
            <th className="border p-2">No Paspor</th>
            <th className="border p-2">No KITAP</th>
            <th className="border p-2">Nama Ayah</th>
            <th className="border p-2">Nama Ibu</th>
          </tr>
        </thead>
        <tbody>
          {anggotaKeluarga.map((anggota) => (
            <tr key={anggota.nik} className="hover:bg-gray-100">
              <td className="border p-2">{anggota.nik}</td>
              <td className="border p-2">{anggota.nama}</td>
              <td className="border px-4 py-2">
                    {anggota.jenis_kelamin === 'perempuan' ? 'Perempuan' : 'Laki-laki'}
                  </td>
              <td className="border p-2">{anggota.tempat_lahir}</td>
              <td className="border p-2">
                {anggota.tanggal_lahir
                  ? new Date(anggota.tanggal_lahir).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })
                  : '-'}
              </td>
              <td className="border p-2">{anggota.agama}</td>
              <td className="border p-2">{anggota.pendidikan}</td>
              <td className="border p-2">{anggota.jenis_pekerjaan}</td>
              <td className="border p-2">{anggota.golongan_darah}</td>
              <td className="border px-4 py-2">
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
              <td className="border p-2">
                {anggota.tanggal_perkawinan
                  ? new Date(anggota.tanggal_perkawinan).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })
                  : '-'}
              </td>
              <td className="border p-2">{anggota.status_hubungan_dalam_keluarga}</td>
              <td className="border p-2">{anggota.kewarganegaraan}</td>
              <td className="border p-2">{anggota.no_paspor || '-'}</td>
              <td className="border p-2">{anggota.no_kitap || '-'}</td>
              <td className="border p-2">{anggota.ayah}</td>
              <td className="border p-2">{anggota.ibu}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}