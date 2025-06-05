import Navbar from './components/HomePage/Navbar';
import './globals.css'; // ← Global styles with tailwind + keyframes
import Providers from './providers'; // ← Client component for session/theme
import { Poppins, Roboto_Flex } from 'next/font/google';
import FloatingPill from './components/HomePage/FloatingPill';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['300', '400', '500', '700'],
});

// Optional metadata (customize as needed)
export const metadata = {
  title: 'PharmShift',
  description: 'Your pharmacy resource hub',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.className}>
      <body>
        <Providers>
          {/* Floating pill animation background */}
          <FloatingPill />
          <Navbar />
          {/* Content above background */}
          <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
        </Providers>
      </body>
    </html>
  );
}
