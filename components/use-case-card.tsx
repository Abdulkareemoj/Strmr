import { Badge, type badgeVariants } from "~/components/ui/badge";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "~/lib/utils";

interface UseCaseCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: {
    text: string;
    variant: NonNullable<Parameters<typeof badgeVariants>[0]>["variant"];
  };
  href?: string;
  className?: string;
}

export function UseCaseCard({
  icon: Icon,
  title,
  description,
  badge,
  href = "#",
  className,
}: UseCaseCardProps) {
  const content = (
    <div
      className={cn(
        "group relative p-6 rounded-lg border border-neutral-800/50 bg-neutral-900/30 hover:bg-neutral-900/60 transition-all duration-300 hover:border-neutral-700 hover:shadow-lg flex flex-col h-full dark:bg-neutral-800/20 dark:hover:bg-neutral-800/50",
        className
      )}
    >
      {/* Icon */}
      <div className="mb-4 inline-flex p-3 rounded-lg bg-neutral-800/50 group-hover:bg-neutral-800 transition-colors w-fit">
        <Icon className="h-6 w-6 text-neutral-300 group-hover:text-white transition-colors" />
      </div>

      {/* Badge */}
      {badge && (
        <Badge variant={badge.variant} className="w-fit mb-3 text-xs">
          {badge.text}
        </Badge>
      )}

      {/* Title */}
      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-neutral-50 transition-colors">
        {title}
      </h3>

      {/* Description */}
      <p className="text-neutral-400 text-sm leading-relaxed flex-grow group-hover:text-neutral-300 transition-colors">
        {description}
      </p>

      {/* Learn More Link */}
      <div className="mt-4 text-sm text-neutral-500 group-hover:text-neutral-300 transition-colors">
        Learn more →
      </div>
    </div>
  );

  return href && href !== "#" ? <Link href={href}>{content}</Link> : content;
}
