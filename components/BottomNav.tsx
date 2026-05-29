'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/', label: 'ホーム', icon: '🏠' },
  { href: '/oshi', label: '推し', icon: '💜' },
  { href: '/goods', label: 'グッズ', icon: '🎁' },
  { href: '/events', label: 'イベント', icon: '🎤' },
  { href: '/stats', label: '統計', icon: '📊' },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 z-40 max-w-lg mx-auto">
      <div className="flex">
        {tabs.map(t => {
          const active = t.href === '/' ? pathname === '/' : pathname.startsWith(t.href);
          return (
            <Link key={t.href} href={t.href} className={`flex-1 flex flex-col items-center py-2 gap-0.5 text-xs transition-colors ${active ? 'text-pink-500' : 'text-gray-400'}`}>
              <span className="text-xl">{t.icon}</span>
              <span className={active ? 'font-bold' : ''}>{t.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
