'use client';

import { useApp } from '@/lib/context';
import Link from 'next/link';
import { useState } from 'react';
import { OshiModal } from '@/components/OshiModal';

export default function Home() {
  const { oshiList, goods, events } = useApp();
  const [showAdd, setShowAdd] = useState(false);

  const totalSpent = [
    ...goods.map(g => g.price),
    ...events.map(e => e.price),
  ].reduce((a, b) => a + b, 0);

  const thisMonth = new Date().toISOString().slice(0, 7);
  const monthlySpent = [
    ...goods.filter(g => g.date.startsWith(thisMonth)).map(g => g.price),
    ...events.filter(e => e.date.startsWith(thisMonth)).map(e => e.price),
  ].reduce((a, b) => a + b, 0);

  const upcomingEvents = events
    .filter(e => !e.attended && e.date >= new Date().toISOString().slice(0, 10))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* ヘッダー */}
      <div className="bg-gradient-to-br from-pink-400 to-purple-500 px-4 pt-12 pb-8 text-white">
        <p className="text-pink-100 text-sm">推し活トラッカー</p>
        <h1 className="text-3xl font-bold mt-1">おかえり 💜</h1>
        <div className="mt-4 flex gap-3">
          <div className="flex-1 bg-white/20 rounded-2xl p-3 text-center backdrop-blur-sm">
            <p className="text-pink-100 text-xs">総課金額</p>
            <p className="text-2xl font-bold">¥{totalSpent.toLocaleString()}</p>
          </div>
          <div className="flex-1 bg-white/20 rounded-2xl p-3 text-center backdrop-blur-sm">
            <p className="text-pink-100 text-xs">今月の出費</p>
            <p className="text-2xl font-bold">¥{monthlySpent.toLocaleString()}</p>
          </div>
          <div className="flex-1 bg-white/20 rounded-2xl p-3 text-center backdrop-blur-sm">
            <p className="text-pink-100 text-xs">推し数</p>
            <p className="text-2xl font-bold">{oshiList.length}人</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* 推し一覧（なければ誘導） */}
        {oshiList.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <p className="text-4xl mb-3">💜</p>
            <p className="font-bold text-gray-700 text-lg">推しを登録しよう</p>
            <p className="text-sm text-gray-400 mt-1">まずは推しを追加してみてください</p>
            <button onClick={() => setShowAdd(true)} className="mt-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold px-6 py-3 rounded-2xl">
              推しを追加する
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-gray-700">推し一覧</h2>
              <Link href="/oshi" className="text-pink-500 text-sm font-medium">すべて見る →</Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {oshiList.map(o => (
                <Link key={o.id} href="/oshi" className="flex flex-col items-center gap-1 min-w-[64px]">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl shadow-sm" style={{ background: o.imageUrl ? undefined : o.color }}>
                    {o.imageUrl ? <img src={o.imageUrl} alt={o.name} className="w-14 h-14 rounded-full object-cover" /> : '💜'}
                  </div>
                  <p className="text-xs text-gray-600 text-center w-16 truncate">{o.name}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 直近イベント */}
        {upcomingEvents.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-gray-700">近日のイベント 🎤</h2>
              <Link href="/events" className="text-purple-500 text-sm font-medium">すべて見る →</Link>
            </div>
            <div className="space-y-2">
              {upcomingEvents.map(e => {
                const oshi = oshiList.find(o => o.id === e.oshiId);
                const daysLeft = Math.ceil((new Date(e.date).getTime() - Date.now()) / 86400000);
                return (
                  <div key={e.id} className="flex items-center gap-3 p-2 rounded-xl bg-purple-50">
                    <div className="w-2 h-2 rounded-full" style={{ background: oshi?.color ?? '#a855f7' }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm truncate">{e.title}</p>
                      <p className="text-xs text-gray-400">{oshi?.name} · {e.date}</p>
                    </div>
                    <span className="text-xs font-bold text-purple-500 whitespace-nowrap">
                      {daysLeft === 0 ? '今日！' : `あと${daysLeft}日`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* クイックリンク */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/goods" className="bg-white rounded-2xl p-4 shadow-sm text-center active:scale-95 transition-transform">
            <p className="text-3xl">🎁</p>
            <p className="font-bold text-gray-700 mt-1">グッズ記録</p>
            <p className="text-xs text-gray-400 mt-0.5">{goods.length}件</p>
          </Link>
          <Link href="/events" className="bg-white rounded-2xl p-4 shadow-sm text-center active:scale-95 transition-transform">
            <p className="text-3xl">🎤</p>
            <p className="font-bold text-gray-700 mt-1">イベント記録</p>
            <p className="text-xs text-gray-400 mt-0.5">{events.length}件</p>
          </Link>
          <Link href="/stats" className="bg-white rounded-2xl p-4 shadow-sm text-center active:scale-95 transition-transform col-span-2">
            <p className="text-3xl">📊</p>
            <p className="font-bold text-gray-700 mt-1">統計・分析</p>
            <p className="text-xs text-gray-400 mt-0.5">課金額・イベント数を確認</p>
          </Link>
        </div>
      </div>

      {showAdd && <OshiModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
