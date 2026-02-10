import { setRequestLocale } from "next-intl/server";
import { TestTtsTrigger } from "./TestTtsTrigger";

type Props = { params: Promise<{ locale: string }> };

export default async function TestPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-paper p-8">
      <h1 className="text-2xl font-bold text-ink mb-4">TTS test</h1>
      <TestTtsTrigger />
    </main>
  );
}
