"use client";

/**
 * SkeletonCard renders a pulsing block container matching the layout height of
 * dynamic portfolio cards, smoothing UI state transitions.
 */
export default function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-white/[0.02] border border-surface-border p-6 flex flex-col gap-4 ${className}`}
    >
      <div className="h-6 bg-white/5 rounded-md w-1/3" />
      <div className="h-10 bg-white/5 rounded-md w-3/4" />
      <div className="space-y-3 mt-2">
        <div className="h-3 bg-white/5 rounded-md w-full" />
        <div className="h-3 bg-white/5 rounded-md w-5/6" />
        <div className="h-3 bg-white/5 rounded-md w-4/5" />
      </div>
      <div className="h-8 bg-white/5 rounded-md w-1/4 mt-auto" />
    </div>
  );
}
