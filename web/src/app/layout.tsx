
import './globals.css';
import Link from 'next/link';
import { AuthStatus } from './parts/AuthStatus';

export const metadata = { title: 'TailorHub Restaurants' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-card-border">
          <div className="container h-16 flex items-center justify-between">
            <Link href="/" className="font-semibold tracking-tight">TailorHub Restaurantes</Link>
            <AuthStatus />
          </div>
        </header>
        <main className="container py-6">{children}</main>
      </body>
    </html>
  );
}
