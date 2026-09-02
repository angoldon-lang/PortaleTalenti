import type { Domain } from '@prisma/client';
import { DOMAIN_META } from '@/content/themes';
import { cn } from '@/lib/utils';

const styles: Record<Domain, string> = {
  EXECUTING: 'bg-violet-50 text-violet-800 ring-violet-200',
  INFLUENCING: 'bg-orange-50 text-orange-800 ring-orange-200',
  RELATIONSHIP: 'bg-cyan-50 text-cyan-800 ring-cyan-200',
  STRATEGIC: 'bg-green-50 text-green-800 ring-green-200',
};

export function DomainBadge({ domain, className }: { domain: Domain; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        styles[domain],
        className,
      )}
    >
      {DOMAIN_META[domain].label}
    </span>
  );
}
