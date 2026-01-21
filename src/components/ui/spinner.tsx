import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Spinner({ size = "md", className }: SpinnerProps) {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      {/* Outer ring with metallic gradient */}
      <div
        className="absolute inset-0 rounded-full animate-spin"
        style={{
          background: `conic-gradient(
            from 0deg,
            hsl(0 0% 95%) 0deg,
            hsl(0 0% 75%) 90deg,
            hsl(0 0% 90%) 180deg,
            hsl(0 0% 60%) 270deg,
            hsl(0 0% 95%) 360deg
          )`,
          mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), black calc(100% - 3px))",
          WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 3px), black calc(100% - 3px))",
        }}
      />
      {/* Inner shimmer effect */}
      <div
        className="absolute inset-1 rounded-full opacity-60"
        style={{
          background: `linear-gradient(
            135deg,
            transparent 0%,
            hsl(0 0% 100% / 0.4) 50%,
            transparent 100%
          )`,
          animation: "shimmer-rotate 2s linear infinite",
        }}
      />
      {/* Center glow */}
      <div
        className="absolute inset-2 rounded-full"
        style={{
          background: "hsl(var(--background))",
          boxShadow: "inset 0 0 10px hsl(0 0% 80% / 0.3)",
        }}
      />
    </div>
  );
}
