'use client';

import { useState } from 'react';
import { useApp } from '@/lib/context';
import { OshiCard } from '@/components/OshiCard';
import { OshiModal } from '@/components/OshiModal';
import type { Oshi } from '@/lib/types';

export default function OshiPage() {
  const { oshiList } = useApp();
  const [selected, setSelected] = useState<Oshi | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-pink-400 to-purple-500 px-4 pt-12 pb-6 text-white">
        <h1 className="text-2xl font-bold">推し管理 💜</h1>
        <p className="text-pink-100 text-sm mt-1">{oshiList.length}人の推し</p>
      </div>

      <div className="px-4 py-4 space-y-3">
        {oshiList.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">💜</p>
            <p>まだ推しが登録されていません</p>
          </div>
        )}
        {oshiList.map(o => (
          <OshiCard key={o.id} oshi={o} onClick={() => setSelected(o)} />
        ))}
      </div>

      {/* FAB */}
      <button onClick={() => setShowAdd(true)} className="fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-500 text-white rounded-full shadow-lg text-2xl flex items-center justify-center active:scale-90 transition-transform">
        +
      </button>

      {selected && <OshiModal oshi={selected} onClose={() => setSelected(null)} />}
      {showAdd && <OshiModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
