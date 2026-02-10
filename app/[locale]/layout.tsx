import type { Metadata } from "next";
import { Fredoka, Playpen_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { LocaleHtmlAttrs } from "@/components/LocaleHtmlAttrs";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

/** Single font for non-Arabic (en, de) */
const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

/** Single font for Arabic */
const playpenSans = Playpen_Sans({
  variable: "--font-playpen-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

// const fontClassNames = [
//   fredoka.variable,
//   playpenSans.variable,
//   "antialiased",
// ].join(" ");

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "Soanki - Automate Your Anki Vocab Decks",
  description:
    "Create beautiful, media-rich flashcards with images and native audio in seconds. Powered by Gemini AI.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning dir={locale === "ar" ? "rtl" : "ltr"}>
      <body className={`${locale === "ar" ? playpenSans.className : fredoka.className} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <LocaleHtmlAttrs />
          <div
            className="bg-paper text-ink selection:bg-soft-yellow selection:text-ink overflow-x-hidden min-h-screen"
          >
            <Navbar />
            {children}
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
