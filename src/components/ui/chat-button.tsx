import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const chatButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 relative group",
  {
    variants: {
      variant: {
        control: "bg-chat-control text-chat-control-text hover:bg-chat-control-hover hover:text-chat-control-text-hover border border-border/50",
        search: "bg-primary text-primary-foreground hover:bg-primary/90 font-semibold",
        send: "bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-soft",
      },
      size: {
        default: "h-10 w-10",
        search: "h-8 px-3 py-1.5 w-auto",
      },
    },
    defaultVariants: {
      variant: "control",
      size: "default",
    },
  }
);

export interface ChatButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof chatButtonVariants> {
  asChild?: boolean;
  tooltip?: string;
}

const ChatButton = React.forwardRef<HTMLButtonElement, ChatButtonProps>(
  ({ className, variant, size, asChild = false, tooltip, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(chatButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
        {tooltip && (
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-foreground text-background px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
            {tooltip}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-foreground"></div>
          </div>
        )}
      </Comp>
    );
  }
);
ChatButton.displayName = "ChatButton";

export { ChatButton, chatButtonVariants };