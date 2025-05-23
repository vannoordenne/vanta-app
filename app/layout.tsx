import React from 'react';
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vanta - Share what matters",
  description: "Een demonstratie van digitale privacy en dataverzameling",
  icons: {
    icon: [
      {
        url: '/vanta-app/favicon.png',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
    shortcut: '/vanta-app/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/vanta-app/favicon.png" />
        <link rel="shortcut icon" href="/vanta-app/favicon.png" />
      </head>
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
} 