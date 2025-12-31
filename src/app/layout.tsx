import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Family Tree | Our Heritage',
  description: 'An interactive family tree and events gallery showcasing our family history across generations',
  keywords: ['family tree', 'genealogy', 'heritage', 'ancestry', 'family history', 'family events', 'photo gallery'],
  authors: [{ name: 'Family Tree App' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
