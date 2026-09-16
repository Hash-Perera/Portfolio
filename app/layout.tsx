import type { Metadata } from 'next';
import './globals.css';
const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://thoughtful-engineer-portfolio.arcane-betta-8876.chatgpt.site';
export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title: 'Your Name — Software Engineer',
  description: 'Software engineer with 3 years of experience. Thoughtful code. Meaningful experiences. Explore my work, experience, and résumé.',
  openGraph: { title: 'Your Name — Software Engineer', description: 'Thoughtful code. Meaningful experiences.', type: 'website', images: [{ url: new URL('/og.png', origin).href, alt: 'Thoughtful code. Meaningful experiences.' }] },
  twitter: { card: 'summary_large_image', title: 'Your Name — Software Engineer', description: 'Thoughtful code. Meaningful experiences.', images: [new URL('/og.png', origin).href] },
};
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html: `try{document.documentElement.dataset.theme=localStorage.getItem('portfolio-theme')==='dark'?'dark':'light'}catch(e){}`}}/></head><body>{children}</body></html>;
}
