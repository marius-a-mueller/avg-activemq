'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { PropsWithChildren, useState } from 'react';

export default function Provider({ children }: Readonly<PropsWithChildren>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" attribute="class">
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
