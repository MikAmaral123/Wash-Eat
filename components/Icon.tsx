import { ICONS } from '@/lib/icons';

export default function Icon({
  name, className, size,
}: { name: string; className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24" width={size} height={size}
      fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round"
      className={className ? `we-ic ${className}` : 'we-ic'} aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: ICONS[name] || '' }}
    />
  );
}
