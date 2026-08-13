import type { Metadata } from "next";
import "@workspace/ui/globals.css"
import Providers from "@/providers/Providers";
import { Toaster } from "@workspace/ui/components/sonner";
import CursorPet from "@/components/common/cursor-pet";
import "./fonts.css";


export const metadata : Metadata = {
  title: "AMDADUL HQ | Portfolio",
  description: "Creative Web Developer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`font-[Montreal] antialiased`}>
        <Providers>
          <Toaster richColors position="bottom-right" />
          {children}
          <CursorPet />
        </Providers>
      </body>
    </html>
  );
}
