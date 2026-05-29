'use client';

import { useState } from 'react';
import type { Oshi } from '@/lib/types';
import { CATEGORIES } from '@/lib/types';
import { useApp } from '@/lib/context';
import { toast } from 'sonner';

const COLORS = ['#ec4899', '#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

type Props = {
  oshi?: Oshi;
  onClose: () => void;
};

export function OshiModal({ oshi, onClose }: Props) {
  const { addOshi, updateOshi, deleteOshi } = useApp();
  const [name, setName] = useState(oshi?.name ?? '');
  const [category, setCategory] = useState<Oshi['category']>(oshi?.category ?? 'idol');
  const [color, setColor] = useState(oshi?.color ?? '#ec4899');
  const [imageUrl, setImageUrl] = useState(oshi?.imageUrl ?? '');
  const [memo, setMemo] = useState(oshi?.memo ?? '');

  async function handleSave() {
    if (!name.trim()) return toast.error('名前を入力してください');
    if (oshi) {
      await updateOshi({ ...oshi, name, category, color, imageUrl: imageUrl || undefined, memo: memo || undefined });
      toast.success('更新しました');
    } else {
      await addOshi({ name, category, color, imageUrl: imageUrl || undefined, memo: memo || undefined });
      toast.success(`${name}を追加しました 💜`);
    }
    onClose();
  }

  async function handleDelete() {
    if (!oshi) return;
    if (!confirm(`${oshi.name}を削除しますか？グッズ・イベントも全て削除されます。`)) return;
    await deleteOshi(oshi.id);
    toast.success('削除しました');
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={onClose}>
      <div className="bg-white w-full max-w-lg mx-auto rounded-t-3xl p-6 space-y-4" onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto" />
        <h2 className="text-lg font-bold text-center">{oshi ? '推しを編集' : '推しを追加'}</h2>

        <div>
          <label className="text-sm font-medium text-gray-600">名前 *</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="推しの名前" className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300" />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">カテゴリ</label>
          <div className="mt-1 flex flex-wrap gap-2">
            {(Object.keys(CATEGORIES) as Oshi['category'][]).map(c => (
              <button key={c} onClick={() => setCategory(c)} className={`px-3 py-1 rounded-full text-sm border transition-colors ${category === c ? 'bg-pink-500 text-white border-pink-500' : 'border-gray-200 text-gray-600'}`}>
                {CATEGORIES[c]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">カラー</label>
          <div className="mt-1 flex gap-2 flex-wrap">
            {COLORS.map(c => (
              <button key={c} onClick={() => setColor(c)} className={`w-8 h-8 rounded-full border-2 transition-transform ${color === c ? 'scale-125 border-gray-800' : 'border-transparent'}`} style={{ background: c }} />
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">画像URL（任意）</label>
          <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm" />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">メモ（任意）</label>
          <input value={memo} onChange={e => setMemo(e.target.value)} placeholder="一言メモ..." className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm" />
        </div>

        <button onClick={handleSave} className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 rounded-2xl text-lg">
          {oshi ? '更新する' : '追加する 💜'}
        </button>
        {oshi && (
          <button onClick={handleDelete} className="w-full text-red-400 text-sm py-2">
            削除する
          </button>
        )}
      </div>
    </div>
  );
}
