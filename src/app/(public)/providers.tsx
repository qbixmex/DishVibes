import type { FC, ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { OrderHydrator } from '@/shared/components/order-hydrator';

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
        <OrderHydrator />
      </ThemeProvider>
      <Toaster
        position="top-right"
        toastOptions={{ style: { width: 400 } }}
        richColors
        duration={3000}
        theme='system'
      />
    </>
  );
};
