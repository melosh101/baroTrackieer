import type { Metadata } from 'next'
import './globals.css'
import { ConvexClientProvider } from "./ConvexClientProvider"
import { ErrorBoundary } from "@/components/error-boundary"
import { PostHogProvider } from "@/components/PostHogProvider"

export const metadata: Metadata = {
  title: 'Baro Ki\'teer Inventory Manager - Warframe Void Trader Tracker',
  description: 'Track your Baro Ki\'teer purchases and calculate missing items from the Void Trader in Warframe. Manage your ducat and credit spending efficiently.',
  keywords: 'Warframe, Baro Ki\'teer, Void Trader, inventory, tracker, ducats, credits, prime',
  authors: [{ name: 'Baro Tracker' }],
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