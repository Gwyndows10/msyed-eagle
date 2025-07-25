import './globals.css';
import { Providers } from './providers';
import NavBar from './NavBar';

export const metadata = {
  title: 'Eagle Project',
  description: 'A modern, clean reporting and management system',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground min-h-screen font-sans">
        <Providers>
          <NavBar />
          <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
} 