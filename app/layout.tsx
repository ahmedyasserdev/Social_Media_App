import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Spotlight } from '@/components/ui/spotlight'
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import {NextSSRPlugin} from "@uploadthing/react/next-ssr-plugin"
import { extractRouterConfig } from "uploadthing/server";
import { fileRouter } from "./api/uploadthing/core";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    template: "%s | bugbook",
    default: "bugbook",
  },
  description: "The social media app for powernerds",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()
  return (
    <SessionProvider session={session} >
        <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <NextSSRPlugin  routerConfig={extractRouterConfig(fileRouter)} />

        <ReactQueryProvider>
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        <main>
        <Spotlight  className=' h-[50vh] md:h-screen top-10 left-0  md:left-20 md:-top-10 ' fill = "rgb(22, 163, 74,.78)"  />
         <Spotlight  className=' h-[60vh] md:h-screen top-10 left-[20px]  md:left-30 md:-top-20 ' fill = "rgb(22, 163, 74 ,.45)"  />
         <Spotlight  className=' h-[70vh] md:h-screen top-10 left-[30px]  md:left-40 md:-top-30 ' fill = "rgb(22, 163, 74 ,.32)"  />

        {children}
        </main>
    </ThemeProvider>
    <Toaster/>
        </ReactQueryProvider>
        
      </body>
    </html>

    </SessionProvider>
  );
}
