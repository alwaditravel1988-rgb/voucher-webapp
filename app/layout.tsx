import './styles.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Voucher System',
  description: 'Issue travel and hotel vouchers'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
