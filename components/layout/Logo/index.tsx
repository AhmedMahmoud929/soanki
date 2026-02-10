import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type LogoSize = "sm" | "md";

const sizeConfig = {
  sm: { image: 32, textClass: "text-xl" },
  md: { image: 40, textClass: "text-2xl" },
} as const;

type LogoProps = {
  /** When set, the logo is wrapped in a link (e.g. to home). */
  href?: string;
  size?: LogoSize;
  className?: string;
};

export function Logo({ href, size = "md", className }: LogoProps) {
  const { image, textClass } = sizeConfig[size];

  const content = (
    <>
      <Image
        src="/images/anki-star.webp"
        alt="Soanki Logo"
        width={image}
        height={image}
      />
      <span
        className={cn(
          "font-bold tracking-tight text-soft-blue-dark font-[family-name:var(--font-fredoka)]",
          textClass
        )}
      >
        Soanki
      </span>
    </>
  );

  const wrapperClass = cn("flex items-center gap-2", className);

  if (href) {
    return (
      <Link href={href} className={wrapperClass}>
        {content}
      </Link>
    );
  }

  return <div className={wrapperClass}>{content}</div>;
}
