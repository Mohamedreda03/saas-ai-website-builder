import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";

import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "aiwa",
  title: {
    default: "aiwa – AI Website Builder",
    template: "%s | aiwa",
  },
  description:
    "aiwa is an AI-powered website builder that generates modern, responsive Next.js components and pages from natural language.",
  keywords: [
    "ai website builder",
    "Next.js",
    "React",
    "Tailwind CSS",
    "shadcn/ui",
    "tRPC",
    "Prisma",
    "AI code generation",
  ],
  authors: [{ name: "aiwa" }],
  creator: "aiwa",
  publisher: "aiwa",
  category: "Technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "aiwa",
    title: "aiwa – AI Website Builder",
    description:
      "Build production-ready Next.js components and pages using AI. Transform ideas into code with aiwa.",
    images: [
      {
        url: "/logo-sm.png",
        width: 1200,
        height: 630,
        alt: "aiwa logo",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#C96342",
        },
      }}
    >
      <TRPCReactProvider>
        <html lang="en" suppressHydrationWarning>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Toaster />
              {children}
            </ThemeProvider>
          </body>
        </html>
      </TRPCReactProvider>
    </ClerkProvider>
  );
}
