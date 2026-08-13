"use client";

import UserProvider from "@/context/UserContext";
import { Providers as ThemeProvider } from "@/components/providers";
import { LocomotiveScrollProvider } from "./LocomotiveScrollProvider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return <ThemeProvider>
          <UserProvider>
            <LocomotiveScrollProvider>
              {children}
            </LocomotiveScrollProvider>
          </UserProvider>
        </ThemeProvider>;
};

export default Providers;
