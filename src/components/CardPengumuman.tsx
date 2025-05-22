'use client';

type PengumumanItem = {
  id: number;
  tanggal: string;
  judul: string;
  subjek: string;
  isi: string;
};

type Props = {
  item: PengumumanItem;
  onClick: (item: PengumumanItem) => void;
};

export default function CardPengumuman({ item, onClick }: Props) {
  return (
    <div
      onClick={() => onClick(item)}
      className="cursor-pointer w-[220px] h-[140px] bg-white rounded-lg shadow-md flex flex-col justify-between p-4 hover:shadow-xl transition"
    >
      <h3 className="font-semibold text-black">{item.judul}</h3>
      <p className="text-sm text-black">{item.subjek}</p>
      <p className="text-xs text-black">{item.tanggal}</p>
    </div>
  );
}
