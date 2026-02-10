import { setRequestLocale } from "next-intl/server";
import { GeneratorView } from "@/components/features/generator";

type Props = { params: Promise<{ locale: string }> };

export default async function GeneratorPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-paper">
      <GeneratorView />
    </main>
  );
}
