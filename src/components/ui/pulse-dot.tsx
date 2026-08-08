export function PulseDot() {
  return (
    <span className="relative inline-flex h-2 w-2 flex-none rounded-full bg-emerald-500">
      <span className="motion-safe:animate-[pulse-ring_1.8s_ease-out_infinite] absolute inset-[-4px] rounded-full border-2 border-emerald-500" />
    </span>
  );
}
