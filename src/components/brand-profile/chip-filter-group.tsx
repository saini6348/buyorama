import { Chip, ChipGrid3 } from "@/components/ui/chip";

interface ChipFilterGroupProps {
  label: string;
  helper?: string;
  options: readonly string[];
  activeOptions?: readonly string[];
  /** xs chips laid out 3-per-row (credit-card Categories/Bank Filters sidebar lists) */
  compact?: boolean;
  hrefFor?: (option: string) => string;
}

export function ChipFilterGroup({ label, helper, options, activeOptions = [], compact = false, hrefFor }: ChipFilterGroupProps) {
  const isActive = (opt: string) => activeOptions.some((a) => a.toLowerCase() === opt.toLowerCase());

  const chips = options.map((opt) => (
    <Chip key={opt} tone={isActive(opt) ? "active" : "ghost"} size={compact ? "xs" : "md"} href={hrefFor?.(opt)}>
      {opt}
    </Chip>
  ));

  return (
    <div>
      <div className="mb-0.5 text-[13px] font-extrabold text-text-primary">{label}</div>
      {helper ? <div className="mb-2.5 text-[11px] text-text-muted">{helper}</div> : null}
      {compact ? <ChipGrid3>{chips}</ChipGrid3> : <div className="flex flex-wrap gap-2">{chips}</div>}
    </div>
  );
}
