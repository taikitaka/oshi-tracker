'use client';

import { useApp } from '@/lib/context';

export default function StatsPage() {
  const { oshiList, goods, events } = useApp();

  const thisMonth = new Date().toISOString().slice(0, 7);
  const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 7);

  function spentFor(oshiId: string) {
    return [
      ...goods.filter(g => g.oshiId === oshiId).map(g => g.price),
      ...events.filter(e => e.oshiId === oshiId).map(e => e.price),
    ].reduce((a, b) => a + b, 0);
  }

  const totalAll = oshiList.reduce((a, o) => a + spentFor(o.id), 0);

  const monthlySpent = (month: string) => [
    ...goods.filter(g => g.date.startsWith(month)).map(g => g.price),
    ...events.filter(e => e.date.startsWith(month)).map(e => e.price),
  ].reduce((a, b) => a + b, 0);

  const ranked = [...oshiList].sort((a, b) => spentFor(b.id) - spentFor(a.id));

  const goodsCount = goods.length;
  const eventsCount = events.filter(e => e.attended).length;

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-purple-500 to-pink-400 px-4 pt-12 pb-6 text-white">
        <h1 className="text-2xl font-bold">統計 📊</h1>
        <p className="text-purple-100 text-sm mt-1">推し活の記録まとめ</p>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* 月別サマリー */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="font-bold text-gray-700 mb-3">月別出費</h2>
          <div className="flex gap-3">
            <div className="flex-1 bg-pink-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400">先月</p>
              <p className="text-xl font-bold text-gray-700">¥{monthlySpent(lastMonth).toLocaleString()}</p>
            </div>
            <div className="flex-1 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-3 text-center border-2 border-pink-200">
              <p className="text-xs text-pink-400 font-bold">今月</p>
              <p className="text-xl font-bold text-pink-500">¥{monthlySpent(thisMonth).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* 全体サマリー */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-3 shadow-sm text-center">
            <p className="text-2xl font-bold text-pink-500">¥{totalAll >= 10000 ? `${(totalAll / 10000).toFixed(1)}万` : totalAll.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">総課金額</p>
          </div>
          <div className="bg-white rounded-2xl p-3 shadow-sm text-center">
            <p className="text-2xl font-bold text-purple-500">{goodsCount}</p>
            <p className="text-xs text-gray-400 mt-1">グッズ数</p>
          </div>
          <div className="bg-white rounded-2xl p-3 shadow-sm text-center">
            <p className="text-2xl font-bold text-pink-500">{eventsCount}</p>
            <p className="text-xs text-gray-400 mt-1">参加イベ</p>
          </div>
        </div>

        {/* 推し別ランキング */}
        {ranked.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h2 className="font-bold text-gray-700 mb-3">推し別課金ランキング 👑</h2>
            <div className="space-y-3">
              {ranked.map((o, i) => {
                const spent = spentFor(o.id);
                const ratio = totalAll > 0 ? (spent / totalAll) * 100 : 0;
                return (
                  <div key={o.id}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-gray-400 w-5">{i + 1}</span>
                      <span className="text-sm font-medium text-gray-700 flex-1">{o.name}</span>
                      <span className="text-sm font-bold text-gray-700">¥{spent.toLocaleString()}</span>
                      <span className="text-xs text-gray-400">{ratio.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden ml-7">
                      <div className="h-full rounded-full transition-all" style={{ width: `${ratio}%`, background: o.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {oshiList.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">📊</p>
            <p>推しを登録するとここに統計が表示されます</p>
          </div>
        )}
      </div>
    </div>
  );
}
