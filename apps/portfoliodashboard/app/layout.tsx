import type { Metadata } from "next";
import "@workspace/ui/globals.css"
import Providers from "@/providers/Providers";
import { Toaster } from "@workspace/ui/components/sonner";
import "./fonts.css"; 


export const metadata : Metadata = {
  title: "AMDADUL HQ | Login",
  description: "Creative Web Developer",
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
