import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ClientWrapper from "@/components/layout/client-wrapper";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sillon - Optimisez votre apprentissage",
  description: "Application d'apprentissage basée sur la courbe d'oubli d'Ebbinghaus.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="light" style={{ colorScheme: "light" }}>
      <body className={inter.className}>
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  )
}
