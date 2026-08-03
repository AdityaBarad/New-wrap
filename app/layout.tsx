import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Archivo, Space_Grotesk } from 'next/font/google'
import { MixpanelProvider } from '@/components/providers/mixpanel-provider'
import './globals.css'

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-archivo',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  title: 'Your Story, Wrapped — Your Era. Unhinged.',
  description:
    'Turn your memories, photos, and personal metrics into a cinematic, share-worthy highlight reel. High-dopamine. Zero chill.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0b0b0b',
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${archivo.variable} ${spaceGrotesk.variable} bg-background`}>
      <body className="font-sans antialiased">
        <MixpanelProvider>
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </MixpanelProvider>
      </body>
    </html>
  )
}
