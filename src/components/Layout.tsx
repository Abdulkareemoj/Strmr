import { type Metadata } from "next";
import { siteConfig } from "~/lib/config";
import Header from "~/components/Header";
// import { Footer } from "~/components/Footer";
import { cn } from "~/lib/utils";
import { ThemeProvider } from "~/components/Provider";
import Head from "next/head";
import { Toaster } from "~/components/ui/toaster"
 
export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["Next.js", "React", "Tailwind CSS", "shadcn/ui", "Radix UI"],
  authors: [
    {
      name: "abdulkareemoj",
      url: "https://www.example.com",
    },
  ],
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@abdulkareemoj",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>{" "}
      <div className={cn("min-h-screen bg-background font-sans antialiased")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Header />

            <main className="flex-1 pt-16 sm:pt-20">{children}</main>
                 <Toaster />{/* <Footer /> */}
          </div>
        </ThemeProvider>{" "}
      </div>
    </>
  );
}
