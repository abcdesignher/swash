import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  metadataBase: new URL("https://swash.ng"),
  applicationName: "Swash",
  title: {
    default: "Swash | Subscription Laundry Service in Lagos",
    template: "%s | Swash Laundry",
  },
  description: "Subscription laundry pickup and delivery across Lagos.",
  keywords: [
    "Swash",
    "laundry subscription Lagos",
    "Nigeria laundry pickup and delivery",
    "monthly laundry allowance",
    "wash and iron subscription",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Swash | Subscription Laundry Service in Lagos",
    description: "Subscription laundry pickup and delivery across Lagos.",
    url: "https://swash.ng",
    siteName: "Swash",
    locale: "en_NG",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
