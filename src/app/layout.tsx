import { Opacity } from '@mui/icons-material';
import Navbar from './components/homepage/Navbar';
import './globals.css'; // ← Global styles with tailwind + keyframes
import Providers from './providers'; // ← Client component for session/theme
import { Poppins, Roboto_Flex } from 'next/font/google';

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
          <div
            style={{
              position: 'fixed',
              top: '25%',
              right: '3vw',
              width: '520px',
              zIndex: 0,
              animation: 'pillFadeIn 1.5s ease-out forwards',
              pointerEvents: 'none',
            }}
          >
            <img src="/pill.png" alt="pill" style={{ width: '100%', height: 'auto', opacity:'0.7'}}  />
          </div>
            <Navbar />
          {/* Content above background */}
          <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
        </Providers>
      </body>
    </html>
  );
}
