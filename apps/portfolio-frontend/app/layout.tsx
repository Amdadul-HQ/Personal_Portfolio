import type { Metadata } from "next";
import "@workspace/ui/globals.css"
import Providers from "@/providers/Providers";
import { Toaster } from "@workspace/ui/components/sonner";
import "./fonts.css"; 
// const inter = Inter({
//   variable: "--font-inter",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "EvenTora |  Manage Your Public & Private Event",
  description: "Manage Your Public & Private Event",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`font-[Montreal] antialiased`}>
        <Providers>
          <Toaster richColors position="bottom-right" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
