import { setRequestLocale } from "next-intl/server";
import {
  Hero,
  ComparisonSection,
  ProcessSection,
  FeaturesSection,
  CTASection,
} from "@/components/features/home";

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <Hero />
      <ComparisonSection />
      <ProcessSection />
      {/* <FeaturesSection /> */}
      <CTASection />
    </main>
  );
}
