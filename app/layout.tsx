import type { Metadata } from 'next'
import { Sora, Inter, JetBrains_Mono } from 'next/font/google'
import Providers from '@/components/providers/Providers'
import './globals.css'
import { connectDB } from '@/lib/db'
import Profile from '@/models/Profile'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  await connectDB()

  const profile = await Profile.findOne()

  const title =
    profile?.seoTitle || 'Mehedi Hasan Arif — Full Stack Developer'

  const description =
    profile?.seoDescription ||
    'Portfolio of Mehedi Hasan Arif, a MERN Stack Developer specializing in Next.js, MongoDB, Express, React, and Node.js.'

  return {
    title: {
      default: title,
      template: '%s | Mehedi Hasan Arif',
    },
    description,
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    ),
    openGraph: {
      title,
      description,
      siteName: 'Mehedi Hasan Arif Portfolio',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      ],
      apple: '/apple-touch-icon.png',
    },
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await connectDB()
  const profile = await Profile.findOne().lean()
  const profileData = profile as {
    name?: string
    github?: string
    linkedin?: string
    facebook?: string
    instagram?: string
  } | null

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profileData?.name || 'Mehedi Hasan Arif',
    jobTitle: 'Full Stack Developer',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    sameAs: [
      profileData?.github,
      profileData?.linkedin,
      profileData?.facebook,
      profileData?.instagram,
    ].filter(Boolean),
  }

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sora.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}