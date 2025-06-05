import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"
import CustomCursor from "@/components/custom-cursor"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bitcoin Wallet Security Quiz',
  description: 'Test your knowledge about Bitcoin wallet security',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <CustomCursor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
