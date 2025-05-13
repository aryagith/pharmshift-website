import './globals.css'; // ← Global styles with tailwind + keyframes
import Providers from './providers'; // ← Client component for session/theme
import { Roboto_Flex } from 'next/font/google';

// Google Font setup
const robotoFlex = Roboto_Flex({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-flex',
  weight: ['300', '400', '500', '700'],
});

// Optional metadata (customize as needed)
export const metadata = {
  title: 'PharmShift',
  description: 'Your pharmacy resource hub',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={robotoFlex.className}>
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
              opacity: 0.7,
              animation: 'pillFadeIn 1.5s ease-out forwards',
              pointerEvents: 'none',
            }}
          >
            <img src="/pill.png" alt="pill" style={{ width: '100%', height: 'auto' }} />
          </div>

          {/* Content above background */}
          <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
        </Providers>
      </body>
    </html>
  );
}
