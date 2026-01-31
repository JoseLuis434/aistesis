import { Outfit } from 'next/font/google';
import './globals.css';

// Configuramos Outfit
const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit', // Esta variable es la que usará Tailwind
});

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={outfit.variable}>
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}