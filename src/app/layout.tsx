import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppProvider';

export const metadata: Metadata = {
  title: 'DG 5 | Work Management & Engineering System',
  description: 'Enterprise Multidisciplinary Work, Project & Engineering Management System for The Design Group Five International (Est. 1972)',
  icons: {
    icon: '/resources/Main-LOGO.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
