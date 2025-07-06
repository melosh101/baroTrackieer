import type { Metadata } from 'next'
import './globals.css'
import { ConvexClientProvider } from "./ConvexClientProvider"
import { ErrorBoundary } from "@/components/error-boundary"
import { PostHogProvider } from "@/components/PostHogProvider"
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Baro Ki\'teer Inventory Manager - Warframe Void Trader Tracker',
  description: 'Track your Baro Ki\'teer purchases and calculate missing items from the Void Trader in Warframe. Manage your ducat and credit spending efficiently.',
  keywords: 'Warframe, Baro Ki\'teer, Void Trader, inventory, tracker, ducats, credits, prime, tennocon baro, baro tracker, warframe baro tracker, warframe baro ki\'teer, warframe void trader, warframe inventory manager',
  authors: [{ name: 'Melosh', url: "https://milasholsting.dk" }],
  robots: 'index, follow',
  openGraph: {
    title: 'Baro Ki\'teer Inventory Manager',
    description: 'Track your Void Trader purchases and calculate missing items in Warframe',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8683265010525240"
     crossOrigin="anonymous"></Script>
     <meta name="google-adsense-account" content="ca-pub-8683265010525240"></meta>
      </head>
      <body>
        <PostHogProvider>
          <ConvexClientProvider>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </ConvexClientProvider>
        </PostHogProvider>
      </body>
    </html>
  )
}