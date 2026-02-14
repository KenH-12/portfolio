import { LucideIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeroBadgeProps {
  icon: LucideIcon;
  text: string;
  opacity?: number;
  transition?: string;
  /** When set (e.g. intro animation), merged with default style; can override opacity. */
  style?: React.CSSProperties;
}

export function HeroBadge({ icon: Icon, text, opacity = 1, transition, style: styleProp }: HeroBadgeProps) {
  const isMobile = useIsMobile();

  return (
    <div 
      className={`inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 ${
        isMobile ? 'px-2 py-1 mx-1 mb-4' : 'px-4 py-1.5 mx-2 mb-8'
      }`}
      style={{
        opacity,
        transition: transition ?? "opacity 1000ms ease-in-out",
        ...styleProp,
      }}
    >
      <Icon className={isMobile ? "h-3 w-3 text-primary" : "h-4 w-4 text-primary"} />
      <span className={isMobile ? "text-[10px] font-medium text-primary mx-0" : "text-sm font-medium text-primary"}>
        {text}
      </span>
    </div>
  );
}
