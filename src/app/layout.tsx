// Essentials
import { Metadata, Viewport } from "next";
import { Merriweather } from "next/font/google";

// Contexts
import AllProviders from "./providers";

// Components
import AppLayout from "./appLayout";

// Models
import { UserSession } from "@/models/User";

// Utils
import getSessionData from "@/utils/auth/getSessionData";

// Styles
import "@/styles/global.scss";

export const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-merriweather",
});

export const metadata: Metadata = {
  title: "Plantkare",
  description: "Kare for your plants.",
  other: {
    "google": "notranslate"
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userSession = await getSessionData() as UserSession;  
  console.log("userSession: ", userSession);
  
  return (
    <html className={merriweather.className + " notranslate"} translate="no">
      <body>
        <AllProviders userSession={userSession}>
          <AppLayout userSession={userSession}>
            {children}
          </AppLayout>
        </AllProviders>
      </body>
    </html>
  );
}