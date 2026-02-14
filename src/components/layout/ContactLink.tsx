import { LucideIcon } from "lucide-react";

interface ContactLinkProps {
  href: string;
  icon: LucideIcon;
  target?: string;
  rel?: string;
  iconSize?: number;
}

export function ContactLink({
  href,
  icon: Icon,
  target,
  rel,
  iconSize = 20,
}: ContactLinkProps) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      data-hoverable
      className="text-primary hover:text-white transition-colors duration-200"
      style={{ textDecoration: 'none' }}
    >
      <Icon size={iconSize} />
    </a>
  );
}
