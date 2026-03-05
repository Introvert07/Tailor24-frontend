export function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] shimmer-loading bg-cream-200" />
      <div className="mt-3 space-y-2 px-1">
        <div className="h-5 shimmer-loading bg-cream-200 w-4/5" />
        <div className="h-4 shimmer-loading bg-cream-200 w-1/2" />
      </div>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-cream-50 flex flex-col items-center justify-center z-50">
      <div className="relative">
        <div className="w-12 h-12 border-2 border-cream-300 border-t-rouge-700 rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-gold-500 rounded-full" />
        </div>
      </div>
      <p className="font-display text-lg text-charcoal/50 mt-4 italic">Loading…</p>
    </div>
  );
}

export function InlineLoader() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="flex gap-1.5">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-2 h-2 bg-rouge-700 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
