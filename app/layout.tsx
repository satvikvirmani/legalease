import { Inter as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';
import StyledComponentsRegistry from '@/app/lib/registry';

import { Toaster } from '@/components/ui/sonner';
import '@/styles/global.css';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});
import { ReactNode } from 'react';

export default function NextAuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased p-0',
          fontSans.variable,
        )}
      >
        <StyledComponentsRegistry>
          {children}
        </StyledComponentsRegistry>
        <Toaster />
      </body>
    </html>
  );
}
