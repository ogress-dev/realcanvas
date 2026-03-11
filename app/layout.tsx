import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter } from 'next/font/google';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://dorodavid.com'),
  title: {
    default: 'David Doro',
    template: '%s | David Doro'
  },
  description: 'Brand and Product Design',

  keywords:[
    "Set Design",
    "Industrial Design",
    "Brand Identity",
    "Web Design",
    "Design Direction",
    "UX&UI",
    "Strategy",
    "Product Design"
    ],

    authors: [{ name: "David Doro" }],
    creator: "David Doro",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'David Doro',
    description: 'Brand and Product Design',
    url: 'https://dorodavid.com',
    siteName: 'David Doro',
    images: [
      {
        url: 'https://dorodavid.com/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'David Doro',
    description: 'Brand and Product Design',
    images: ['https://dorodavid.com/og-image.png'],
  },
  alternates: {
    canonical: 'https://dorodavid.com',
    languages: {
      'en-US': 'https://dorodavid.com/en',
      'es-ES': 'https://dorodavid.com/es',
      'it': 'https://dorodavid.it',      
      'it-IT': 'https://dorodavid.it',    
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "David Doro",
    "jobTitle": "Brand and Product Designer",
    "worksFor": {
      "@type": "Organization",
      "name": "David Doro",
      "location": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Treviso",
          "addressRegion": "Veneto",
          "addressCountry": "IT"
        }
      }
    },
    "url": "https://dorodavid.com",
    "sameAs": [
      "https://www.linkedin.com/in/david-doro-design-industriale/",
      // "https://twitter.com/daviddoro"
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "David Doro",
    "url": "https://dorodavid.com",
    "description": "Brand and Product Design",
    "author": {
      "@type": "Person",
      "name": "David Doro"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "David Doro Studio",
    "url": "https://dorodavid.com",
    "logo": "https://dorodavid.com/logo.png",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Treviso",
      "addressRegion": "Veneto",
      "addressCountry": "IT"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "hello@dorodavid.com",
      "contactType": "customer service"
    }
  }
];

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Analytics/>
      </body>
    </html>
  );
}
