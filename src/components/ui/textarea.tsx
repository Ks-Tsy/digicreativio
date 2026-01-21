import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-[hsl(0_0%_25%)] px-3 py-2 text-sm ring-offset-background",
        "bg-gradient-to-br from-[hsl(220_15%_8%)] via-[hsl(220_15%_6%)] to-[hsl(220_15%_9%)]",
        "placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:border-[hsl(0_0%_50%)] focus-visible:shadow-[0_0_15px_hsl(0_0%_60%/0.2)]",
        "hover:border-[hsl(0_0%_35%)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "transition-all duration-300",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
