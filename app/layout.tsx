import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/context';
import { BottomNav } from '@/components/BottomNav';
import { ClientShell } from '@/components/ClientShell';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: '推し活トラッカー',
  description: '推しへの愛と課金を記録するアプリ',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-pink-50">
        <AppProvider>
          <ClientShell>
            <main className="pb-20 max-w-lg mx-auto">
              {children}
            </main>
            <BottomNav />
          </ClientShell>
          <Toaster position="top-center" richColors />
        </AppProvider>
      </body>
    </html>
  );
}
