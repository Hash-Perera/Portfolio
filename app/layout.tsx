import type { Metadata } from 'next';
import { portfolio } from './portfolio';
import './globals.css';
const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://thoughtful-engineer-portfolio.anns01.chatgpt.site';
export const metadata: Metadata = {
  metadataBase: new URL(origin),
  icons: { icon: '/icon.png' },
  title: `${portfolio.name} — Software Engineer`,
  description: portfolio.summary,
  openGraph: { title: `${portfolio.name} — Software Engineer`, description: portfolio.summary, type: 'website', images: [{ url: new URL('/og.png', origin).href, alt: 'Thoughtful code. Meaningful experiences.' }] },
  twitter: { card: 'summary_large_image', title: `${portfolio.name} — Software Engineer`, description: portfolio.summary, images: [new URL('/og.png', origin).href] },
};
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="en" data-theme="dark" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html: `try{document.documentElement.dataset.theme=localStorage.getItem('portfolio-theme-v2')==='light'?'light':'dark'}catch(e){}`}}/></head><body>{children}</body></html>;
}
