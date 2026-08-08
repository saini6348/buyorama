export function BrandProfileStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex-1 text-center">
      <div className="tabular font-display text-base text-text-primary">{value}</div>
      <div className="text-[10.5px] font-bold uppercase tracking-wide text-text-muted">{label}</div>
    </div>
  );
}
