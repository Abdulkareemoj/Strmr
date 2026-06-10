import { Badge, type badgeVariants } from "~/components/ui/badge";
import { cn } from "~/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  badge?: {
    text: string;
    variant: NonNullable<Parameters<typeof badgeVariants>[0]>["variant"];
  };
  className?: string;
}

export function SectionHeader({
  title,
  description,
  badge,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("space-y-2 mb-6", className)}>
      <div className="flex items-center gap-3">
        <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
        {badge && (
          <Badge variant={badge.variant} className="text-xs">
            {badge.text}
          </Badge>
        )}
      </div>
      {description && (
        <p className="text-neutral-400 text-sm md:text-base">{description}</p>
      )}
    </div>
  );
}
