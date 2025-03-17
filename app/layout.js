"use client";

import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600'],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: '--font-display',
  display: 'swap',
  weight: ['500', '600', '700'],
});

// Metadata needs to be in a separate file or removed from client components
const siteConfig = {
  title: "EventFlow",
  description: "Professional Event Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <head>
        <title>{siteConfig.title}</title>
        <meta name="description" content={siteConfig.description} />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
        <Toaster 
          position="top-right" 
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#334155',
              borderRadius: '1rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              fontFamily: 'var(--font-body)',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}