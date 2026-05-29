'use client';

import { useState } from 'react';
import type { Event } from '@/lib/types';
import { EVENT_TYPES } from '@/lib/types';
import { useApp } from '@/lib/context';
import { toast } from 'sonner';

type Props = { event?: Event; defaultOshiId?: string; onClose: () => void };

export function EventModal({ event, defaultOshiId, onClose }: Props) {
  const { oshiList, addEvent, updateEvent, deleteEvent } = useApp();
  const [oshiId, setOshiId] = useState(event?.oshiId ?? defaultOshiId ?? oshiList[0]?.id ?? '');
  const [title, setTitle] = useState(event?.title ?? '');
  const [type, setType] = useState<Event['type']>(event?.type ?? 'live');
  const [date, setDate] = useState(event?.date ?? new Date().toISOString().slice(0, 10));
  const [price, setPrice] = useState(event?.price.toString() ?? '0');
  const [attended, setAttended] = useState(event?.attended ?? false);
  const [memo, setMemo] = useState(event?.memo ?? '');

  async function handleSave() {
    if (!title.trim()) return toast.error('タイトルを入力してください');
    if (!oshiId) return toast.error('推しを選択してください');
    const data = { oshiId, title, type, date, price: Number(price) || 0, attended, memo: memo || undefined };
    if (event) {
      await updateEvent({ ...event, ...data });
      toast.success('更新しました');
    } else {
      await addEvent(data);
      toast.success('イベントを記録しました 🎤');
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={onClose}>
      <div className="bg-white w-full max-w-lg mx-auto rounded-t-3xl p-6 space-y-4" onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto" />
        <h2 className="text-lg font-bold text-center">{event ? 'イベントを編集' : 'イベントを記録'}</h2>

        <div>
          <label className="text-sm font-medium text-gray-600">推し *</label>
          <select value={oshiId} onChange={e => setOshiId(e.target.value)} className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300">
            {oshiList.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">タイトル *</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="〇〇ツアー2025..." className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300" />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">種類</label>
          <div className="mt-1 flex flex-wrap gap-2">
            {(Object.keys(EVENT_TYPES) as Event['type'][]).map(t => (
              <button key={t} onClick={() => setType(t)} className={`px-3 py-1 rounded-full text-sm border transition-colors ${type === t ? 'bg-purple-500 text-white border-purple-500' : 'border-gray-200 text-gray-600'}`}>
                {EVENT_TYPES[t]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-600">金額 (¥)</label>
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300" />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-600">日付</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setAttended(!attended)} className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${attended ? 'bg-purple-500 border-purple-500' : 'border-gray-300'}`}>
            {attended && <span className="text-white text-xs">✓</span>}
          </button>
          <span className="text-sm text-gray-600">参加済み</span>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">メモ（任意）</label>
          <input value={memo} onChange={e => setMemo(e.target.value)} placeholder="感想、セトリ..." className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm" />
        </div>

        <button onClick={handleSave} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-2xl text-lg">
          {event ? '更新する' : '記録する 🎤'}
        </button>
        {event && (
          <button onClick={async () => { await deleteEvent(event.id); toast.success('削除しました'); onClose(); }} className="w-full text-red-400 text-sm py-2">
            削除する
          </button>
        )}
      </div>
    </div>
  );
}
