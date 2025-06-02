interface DetailKeluargaTableProps {
    anggotaKeluarga: {
      nik: string;
      nama: string;
      status_hubungan_dalam_keluarga: string;
      tanggal_lahir: string | null;
    }[];
  }
  
  export default function DetailKeluargaTable({ anggotaKeluarga }: DetailKeluargaTableProps) {
    return (
      <table className="w-full border border-gray-300 rounded-md">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-300 p-3 text-left">NIK</th>
            <th className="border border-gray-300 p-3 text-left">Nama</th>
            <th className="border border-gray-300 p-3 text-left">Status Hubungan</th>
            <th className="border border-gray-300 p-3 text-left">Tanggal Lahir</th>
          </tr>
        </thead>
        <tbody>
          {anggotaKeluarga.map((anggota) => (
            <tr key={anggota.nik} className="hover:bg-gray-100">
              <td className="border border-gray-300 p-3">{anggota.nik}</td>
              <td className="border border-gray-300 p-3">{anggota.nama}</td>
              <td className="border border-gray-300 p-3">{anggota.status_hubungan_dalam_keluarga}</td>
              <td className="border border-gray-300 p-3">
                {anggota.tanggal_lahir
                  ? new Date(anggota.tanggal_lahir).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })
                  : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  