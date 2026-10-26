import type { FC, ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

type Props = Readonly<{ children: ReactNode; }>;

export const Providers: FC<Props> = ({ children }) => {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
      <Toaster
        position="top-right"
        toastOptions={{ style: { width: 400 } }}
        richColors
      />
    </>
  );
};
