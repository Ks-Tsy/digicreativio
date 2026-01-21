import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-[hsl(0_0%_25%)] bg-gradient-to-br from-[hsl(220_15%_8%)] via-[hsl(220_15%_6%)] to-[hsl(220_15%_9%)] px-3 py-2 text-base ring-offset-background",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:border-[hsl(0_0%_50%)] focus-visible:shadow-[0_0_15px_hsl(0_0%_60%/0.2)]",
          "hover:border-[hsl(0_0%_35%)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-all duration-300",
          "md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
