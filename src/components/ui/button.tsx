import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-[hsl(0_0%_85%)] via-[hsl(0_0%_95%)] to-[hsl(0_0%_75%)] text-primary-foreground hover:from-[hsl(0_0%_90%)] hover:via-[hsl(0_0%_100%)] hover:to-[hsl(0_0%_80%)] hover:shadow-[0_0_20px_hsl(0_0%_80%/0.4)]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-[hsl(0_0%_60%)] bg-background hover:bg-[hsl(0_0%_20%)] hover:border-[hsl(0_0%_80%)] hover:shadow-[0_0_15px_hsl(0_0%_70%/0.2)]",
        secondary: "bg-gradient-to-r from-[hsl(0_0%_25%)] via-[hsl(0_0%_35%)] to-[hsl(0_0%_25%)] text-secondary-foreground hover:from-[hsl(0_0%_30%)] hover:via-[hsl(0_0%_40%)] hover:to-[hsl(0_0%_30%)]",
        ghost: "hover:bg-[hsl(0_0%_20%)] hover:text-[hsl(0_0%_90%)]",
        link: "text-primary underline-offset-4 hover:underline",
        metallic: "bg-gradient-to-r from-[hsl(0_0%_70%)] via-[hsl(0_0%_90%)] to-[hsl(0_0%_70%)] text-primary-foreground hover:from-[hsl(0_0%_75%)] hover:via-[hsl(0_0%_95%)] hover:to-[hsl(0_0%_75%)] hover:shadow-[0_0_25px_hsl(0_0%_85%/0.5)] border border-[hsl(0_0%_60%)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
