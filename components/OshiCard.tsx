'use client';

import type { Oshi } from '@/lib/types';
import { CATEGORIES } from '@/lib/types';
import { useApp } from '@/lib/context';

type Props = { oshi: Oshi; onClick?: () => void };

export function OshiCard({ oshi, onClick }: Props) {
  const { goods, events } = useApp();
  const totalSpent = [
    ...goods.filter(g => g.oshiId === oshi.id).map(g => g.price),
    ...events.filter(e => e.oshiId === oshi.id).map(e => e.price),
  ].reduce((a, b) => a + b, 0);

  return (
    <div
      onClick={onClick}
      className="rounded-2xl p-4 cursor-pointer active:scale-95 transition-transform shadow-sm"
      style={{ background: `linear-gradient(135deg, ${oshi.color}22, ${oshi.color}44)`, borderLeft: `4px solid ${oshi.color}` }}
    >
      <div className="flex items-center gap-3">
        {oshi.imageUrl ? (
          <img src={oshi.imageUrl} alt={oshi.name} className="w-14 h-14 rounded-full object-cover border-2" style={{ borderColor: oshi.color }} />
        ) : (
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl" style={{ background: oshi.color }}>
            💜
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-800 text-lg truncate">{oshi.name}</p>
          <p className="text-sm text-gray-500">{CATEGORIES[oshi.category]}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">総課金額</p>
          <p className="font-bold text-gray-700">¥{totalSpent.toLocaleString()}</p>
        </div>
      </div>
      {oshi.memo && <p className="mt-2 text-sm text-gray-500 truncate">{oshi.memo}</p>}
    </div>
  );
}
