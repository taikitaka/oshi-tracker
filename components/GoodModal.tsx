'use client';

import { useState } from 'react';
import type { Good } from '@/lib/types';
import { useApp } from '@/lib/context';
import { toast } from 'sonner';

type Props = { good?: Good; defaultOshiId?: string; onClose: () => void };

export function GoodModal({ good, defaultOshiId, onClose }: Props) {
  const { oshiList, addGood, updateGood, deleteGood } = useApp();
  const [oshiId, setOshiId] = useState(good?.oshiId ?? defaultOshiId ?? oshiList[0]?.id ?? '');
  const [name, setName] = useState(good?.name ?? '');
  const [price, setPrice] = useState(good?.price.toString() ?? '0');
  const [date, setDate] = useState(good?.date ?? new Date().toISOString().slice(0, 10));
  const [memo, setMemo] = useState(good?.memo ?? '');

  async function handleSave() {
    if (!name.trim()) return toast.error('グッズ名を入力してください');
    if (!oshiId) return toast.error('推しを選択してください');
    const data = { oshiId, name, price: Number(price) || 0, date, memo: memo || undefined };
    if (good) {
      await updateGood({ ...good, ...data });
      toast.success('更新しました');
    } else {
      await addGood(data);
      toast.success('グッズを記録しました 🎁');
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={onClose}>
      <div className="bg-white w-full max-w-lg mx-auto rounded-t-3xl p-6 space-y-4" onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto" />
        <h2 className="text-lg font-bold text-center">{good ? 'グッズを編集' : 'グッズを記録'}</h2>

        <div>
          <label className="text-sm font-medium text-gray-600">推し *</label>
          <select value={oshiId} onChange={e => setOshiId(e.target.value)} className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300">
            {oshiList.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">グッズ名 *</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Tシャツ、写真集..." className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300" />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-600">金額 (¥)</label>
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300" />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-600">購入日</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">メモ（任意）</label>
          <input value={memo} onChange={e => setMemo(e.target.value)} placeholder="どこで買ったか、感想..." className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm" />
        </div>

        <button onClick={handleSave} className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 rounded-2xl text-lg">
          {good ? '更新する' : '記録する 🎁'}
        </button>
        {good && (
          <button onClick={async () => { await deleteGood(good.id); toast.success('削除しました'); onClose(); }} className="w-full text-red-400 text-sm py-2">
            削除する
          </button>
        )}
      </div>
    </div>
  );
}
