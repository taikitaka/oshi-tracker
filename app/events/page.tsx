'use client';

import { useState } from 'react';
import { useApp } from '@/lib/context';
import { EventModal } from '@/components/EventModal';
import { EVENT_TYPES } from '@/lib/types';
import type { Event } from '@/lib/types';

const TYPE_EMOJI: Record<Event['type'], string> = {
  live: '🎤', handshake: '🤝', movie: '🎬', online: '💻', other: '🌟',
};

export default function EventsPage() {
  const { events, oshiList } = useApp();
  const [selected, setSelected] = useState<Event | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [filterOshiId, setFilterOshiId] = useState<string>('all');
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

  const today = new Date().toISOString().slice(0, 10);
  const base = filterOshiId === 'all' ? events : events.filter(e => e.oshiId === filterOshiId);
  const upcoming = base.filter(e => !e.attended && e.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  const past = base.filter(e => e.attended || e.date < today).sort((a, b) => b.date.localeCompare(a.date));
  const shown = tab === 'upcoming' ? upcoming : past;

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-purple-500 to-pink-400 px-4 pt-12 pb-6 text-white">
        <h1 className="text-2xl font-bold">イベント記録 🎤</h1>
        <p className="text-purple-100 text-sm mt-1">予定 {upcoming.length}件 / 参加済 {past.length}件</p>
      </div>

      {/* フィルター */}
      <div className="px-4 py-3 bg-white border-b border-gray-100 flex gap-2 overflow-x-auto">
        <button onClick={() => setFilterOshiId('all')} className={`px-3 py-1 rounded-full text-sm whitespace-nowrap border transition-colors ${filterOshiId === 'all' ? 'bg-purple-500 text-white border-purple-500' : 'border-gray-200 text-gray-600'}`}>
          すべて
        </button>
        {oshiList.map(o => (
          <button key={o.id} onClick={() => setFilterOshiId(o.id)} className={`px-3 py-1 rounded-full text-sm whitespace-nowrap border transition-colors ${filterOshiId === o.id ? 'text-white border-transparent' : 'border-gray-200 text-gray-600'}`} style={filterOshiId === o.id ? { background: o.color } : {}}>
            {o.name}
          </button>
        ))}
      </div>

      {/* タブ */}
      <div className="px-4 pt-3 flex gap-2">
        <button onClick={() => setTab('upcoming')} className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${tab === 'upcoming' ? 'bg-purple-500 text-white' : 'bg-white text-gray-500'}`}>
          予定 {upcoming.length}
        </button>
        <button onClick={() => setTab('past')} className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${tab === 'past' ? 'bg-purple-500 text-white' : 'bg-white text-gray-500'}`}>
          参加済 {past.length}
        </button>
      </div>

      <div className="px-4 py-4 space-y-2">
        {shown.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">🎤</p>
            <p>{tab === 'upcoming' ? '予定イベントなし' : '参加済みイベントなし'}</p>
          </div>
        )}
        {shown.map(e => {
          const oshi = oshiList.find(o => o.id === e.oshiId);
          const daysLeft = Math.ceil((new Date(e.date).getTime() - Date.now()) / 86400000);
          return (
            <div key={e.id} onClick={() => setSelected(e)} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 cursor-pointer active:scale-98 transition-transform">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: `${oshi?.color ?? '#a855f7'}22` }}>
                {TYPE_EMOJI[e.type]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">{e.title}</p>
                <p className="text-xs text-gray-400">{oshi?.name} · {e.date} · {EVENT_TYPES[e.type]}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-700 text-sm">¥{e.price.toLocaleString()}</p>
                {tab === 'upcoming' && (
                  <p className="text-xs text-purple-400 font-bold">{daysLeft <= 0 ? '今日！' : `${daysLeft}日後`}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={() => setShowAdd(true)} className="fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full shadow-lg text-2xl flex items-center justify-center active:scale-90 transition-transform">
        +
      </button>

      {selected && <EventModal event={selected} onClose={() => setSelected(null)} />}
      {showAdd && <EventModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
