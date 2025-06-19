'use client'
import useSWR from 'swr'
import { format } from 'date-fns'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function TabelTagihanWarga() {
  const { data, error, isLoading } = useSWR('/api/warga/tagihan', fetcher)

  if (isLoading) return <p>Loading...</p>
  if (error || data?.error) return <p>Error loading data</p>
  if (!Array.isArray(data)) return <p>Tidak ada data tagihan.</p>

  return (
    <div className="overflow-x-auto text-gray-900">
      <table className="min-w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-2 border">Nama Iuran</th>
            <th className="px-4 py-2 border">Nominal</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Tanggal Bayar</th>
            <th className="px-4 py-2 border">Jatuh Tempo</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item: any) => (
            <tr key={item.id}>
              <td className="px-4 py-2 border">{item.iuran?.nama || '-'}</td>
              <td className="px-4 py-2 border">
                Rp {Number(item.iuran?.nominal || 0).toLocaleString()}
              </td>
              <td className="px-4 py-2 border capitalize">
                {item.status || '-'}
              </td>
              <td className="px-4 py-2 border">
                {item.tanggal_bayar
                  ? format(new Date(item.tanggal_bayar), 'dd-MM-yyyy')
                  : '-'}
              </td>
              <td className="px-4 py-2 border">
                {item.iuran?.tanggal_tempo
                  ? format(new Date(item.iuran.tanggal_tempo), 'dd-MM-yyyy')
                  : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
