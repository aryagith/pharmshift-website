'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../lib/theme';
import { Noto_Sans_Georgian, Roboto, Roboto_Flex } from 'next/font/google';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const robotoFlex = Roboto_Flex({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-flex',
  weight: ['300', '400', '500', '700'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={robotoFlex.className}>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />

          {/* Floating pill background with fade-in */}
          <div
          style={{
            position: 'fixed',
            top: '25%',
            right: '3vw',
            width: '520px',
            zIndex: 0,
            opacity: 0.70,
            animation: 'pillFadeIn 1.5s ease-out forwards',
            pointerEvents: 'none',
          }}
        >
          <img src="/pill.png" alt="pill" style={{ width: '100%', height: 'auto' }} />
        </div>

          {/* Content on top of pill */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            {children}
          </div>

          {/* CSS animation keyframes */}
          <style jsx global>{`
            @keyframes pillFadeIn {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </ThemeProvider>
      </body>
    </html>
  );
}
