import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/app/providers";
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "LegalEase - Your legal assistant"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className='light'>
      <body className={`${poppins.className} antialiased text-neutral-800`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
