// src/app/layout.tsx
import type { Metadata, Viewport } from "next"
import { Toaster } from "sonner"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
})

// Mover themeColor para viewport (evita o aviso do Next)
export const viewport: Viewport = {
  themeColor: "#b45309",
}

// Metadata sem themeColor; usar novo nome do app
export const metadata: Metadata = {
  title: "AMBAR RPG",
  description: "Crie personagens, mesas e rolagens com fluidez — como uma campanha bem narrada.",
  applicationName: "AMBAR RPG",
  // O manifest será servido por app/manifest.(json|ts); não precisa apontar aqui, mas pode deixar se quiser
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", url: "/icons/icon-192.png" },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
