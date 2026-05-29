'use client';

import { useState } from 'react';
import { useApp } from '@/lib/context';
import { GoodModal } from '@/components/GoodModal';
import type { Good } from '@/lib/types';

export default function GoodsPage() {
  const { goods, oshiList } = useApp();
  const [selected, setSelected] = useState<Good | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [filterOshiId, setFilterOshiId] = useState<string>('all');

  const filtered = filterOshiId === 'all' ? goods : goods.filter(g => g.oshiId === filterOshiId);
  const total = filtered.reduce((a, b) => a + b.price, 0);

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-pink-400 to-purple-500 px-4 pt-12 pb-6 text-white">
        <h1 className="text-2xl font-bold">グッズ記録 🎁</h1>
        <p className="text-pink-100 text-sm mt-1">合計 ¥{total.toLocaleString()}</p>
      </div>

      {/* フィルター */}
      <div className="px-4 py-3 bg-white border-b border-gray-100 flex gap-2 overflow-x-auto">
        <button onClick={() => setFilterOshiId('all')} className={`px-3 py-1 rounded-full text-sm whitespace-nowrap border transition-colors ${filterOshiId === 'all' ? 'bg-pink-500 text-white border-pink-500' : 'border-gray-200 text-gray-600'}`}>
          すべて
        </button>
        {oshiList.map(o => (
          <button key={o.id} onClick={() => setFilterOshiId(o.id)} className={`px-3 py-1 rounded-full text-sm whitespace-nowrap border transition-colors ${filterOshiId === o.id ? 'text-white border-transparent' : 'border-gray-200 text-gray-600'}`} style={filterOshiId === o.id ? { background: o.color, borderColor: o.color } : {}}>
            {o.name}
          </button>
        ))}
      </div>

      <div className="px-4 py-4 space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">🎁</p>
            <p>グッズが記録されていません</p>
          </div>
        )}
        {filtered.map(g => {
          const oshi = oshiList.find(o => o.id === g.oshiId);
          return (
            <div key={g.id} onClick={() => setSelected(g)} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 active:scale-98 transition-transform cursor-pointer">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: `${oshi?.color ?? '#ec4899'}22` }}>
                🎁
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">{g.name}</p>
                <p className="text-xs text-gray-400">{oshi?.name} · {g.date}</p>
                {g.memo && <p className="text-xs text-gray-400 truncate">{g.memo}</p>}
              </div>
              <p className="font-bold text-gray-700">¥{g.price.toLocaleString()}</p>
            </div>
          );
        })}
      </div>

      <button onClick={() => setShowAdd(true)} className="fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-500 text-white rounded-full shadow-lg text-2xl flex items-center justify-center active:scale-90 transition-transform">
        +
      </button>

      {selected && <GoodModal good={selected} onClose={() => setSelected(null)} />}
      {showAdd && <GoodModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
