import "~/styles/globals.css";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { extractRouterConfig } from "uploadthing/server";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ActiveThemeProvider } from "~/components/theme/active-theme";
import Providers from "~/components/theme/providers";
import { Toaster } from "~/components/ui/sonner";
import { TRPCReactProvider } from "~/trpc/react";
import { ourFileRouter } from "./api/uploadthing/core";

export const metadata: Metadata = {
  title: "Cashier App",
  description: "Proudly created for pasarresik.inc",
  icons: [{ rel: "icon", url: "/favicon.png" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <TRPCReactProvider>
          <Providers>
            <NuqsAdapter>
              <ActiveThemeProvider>
                <NextSSRPlugin
                  routerConfig={extractRouterConfig(ourFileRouter)}
                />
                <Toaster />
                {children}
              </ActiveThemeProvider>
            </NuqsAdapter>
          </Providers>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
