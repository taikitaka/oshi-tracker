'use client';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-pink-400 to-purple-500 flex flex-col items-center justify-center gap-4 z-50">
      <div className="text-5xl animate-bounce">💜</div>
      <p className="text-white font-bold text-lg tracking-wide">読み込み中...</p>
    </div>
  );
}
