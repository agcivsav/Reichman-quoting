import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Reichman Sales | Quoting Dashboard',
  description: 'Agricultural chemicals quoting and order management',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
