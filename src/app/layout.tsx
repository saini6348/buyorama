import type { Metadata } from "next";
import "./globals.css";
import { baloo2, manrope, jetbrainsMono } from "@/lib/fonts";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { MotionProvider } from "@/components/providers/motion-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { SiteChrome } from "@/components/layout/site-chrome";
import { getSearchIndex } from "@/lib/content/get-search-index";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/json-ld";
import { SITE_URL } from "@/lib/seo/constants";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "BUY-O-RAMA — We Do the Searching. You Do the Saving.",
    template: "%s | BUY-O-RAMA",
  },
  description:
    "Live deals, coupon codes and credit card offers from Amazon, Flipkart, Myntra, Ajio, Meesho and more — updated all day, every day.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const searchIdx = await getSearchIndex();

  return (
    <html lang="en" suppressHydrationWarning className={`${baloo2.variable} ${manrope.variable} ${jetbrainsMono.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        <ThemeProvider>
          <MotionProvider>
            <SiteChrome
              header={<Header />}
              footer={<Footer />}
              mobileNav={<MobileBottomNav searchIndex={searchIdx} />}
            >
              {children}
            </SiteChrome>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
