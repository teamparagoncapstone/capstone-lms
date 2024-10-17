import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "../providers/providers";
import ToasterProvider from "@/components/ToasterProvider";
import IdleTimeout from '../components/IdleTimeout' // Import the new component




const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BCCSI Learning Management System",
  description: "BCCSI Learning Management System.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
      <ThemeProvider
      attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
       <Providers>
        <ToasterProvider />
        <IdleTimeout /> {/* Include the new component */}
        {children}
        </Providers>
        </ThemeProvider>
        </body>
    </html>
  );
}