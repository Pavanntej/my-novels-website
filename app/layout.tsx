// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';  // This imports your Tailwind + custom styles

// Optional: You can add fonts, providers, etc. later
// For now, keep it simple

export const metadata: Metadata = {
  title: 'My Novels Website',
  description: 'Cinematic showcase of novels with trailers and more',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
