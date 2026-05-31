import type { Metadata } from "next";
import { Great_Vibes, Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://drewberry.vercel.app/"),
  title: {
    default: "drewberry",
    template: "%s | drewberry",
  },
  description: "drewberry movie website",
  applicationName: "drewberry",
  keywords: [
    "drewberry",
    "movies",
    "romcoms",
    "Barbie movies",
    "Tinker Bell",
    "streaming app",
  ],
  authors: [{ name: "drewberry" }],
  creator: "drewberry",
  publisher: "drewberry",
  openGraph: {
    title: "drewberry",
    description: "drewberry movie website",
    siteName: "drewberry",
    type: "website",
    images: [
      {
        url: "/pinkb.png",
        width: 512,
        height: 512,
        alt: "drewberry butterfly mark",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "drewberry",
    description: "drewberry movie website",
    images: ["/pinkb.png"],
  },
  icons: {
    icon: "/pinkb.png",
    apple: "/pinkb.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${playfair.variable} ${greatVibes.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
