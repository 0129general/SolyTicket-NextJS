// layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientProvider from "./ClientProvider"; // Import the client provider
import { HomepageApi } from "./api/homepage";
import { montserrat } from "./styles/font";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SolyTicket",
  description: "Generated by DexterSol",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${montserrat.variable}`}>
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}