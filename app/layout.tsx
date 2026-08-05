import type { Metadata } from 'next';
import '../styles.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Wash&eat · La laverie connectée',
  description: 'Lancez une machine depuis votre téléphone, prenez un café, profitez du wi-fi. La laverie connectée, ouverte 24h/24.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><circle cx='16' cy='16' r='11' fill='none' stroke='%23F5502B' stroke-width='5'/></svg>" />
      </head>
      <body>{children}</body>
    </html>
  );
}
