import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function PriceRow({ price, originalPrice, size = "md" }: { price: number; originalPrice?: number; size?: "sm" | "md" }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className={cn("tabular font-display text-brand-pink-deep dark:text-[#ff6fa9]", size === "md" ? "text-xl" : "text-sm")}>
        {formatPrice(price)}
      </span>
      {originalPrice ? <span className="tabular text-xs text-text-muted line-through">{formatPrice(originalPrice)}</span> : null}
    </div>
  );
}
