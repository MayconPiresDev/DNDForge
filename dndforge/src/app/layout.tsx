import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import MainLayout from '@/components/layout/main-layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'D&D Forge',
    description: 'Sistema de fichas de personagem para D&D',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-BR" suppressHydrationWarning>
        <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <MainLayout>{children}</MainLayout>
        </ThemeProvider>
        </body>
        </html>
    )
}
