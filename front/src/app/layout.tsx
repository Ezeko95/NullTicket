import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '@/components/Sidebar';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: 'SmartTickets AI',
  description: 'Sistema de gestión de tickets',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <Providers>
          <div className="dashboard-layout">
            <Sidebar />
            <header className="dashboard-header flex justify-between">
              <h1 className="text-xl font-semibold">Resumen de Sistema</h1>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold">
                  U
                </div>
              </div>
            </header>
            <main className="dashboard-main">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
