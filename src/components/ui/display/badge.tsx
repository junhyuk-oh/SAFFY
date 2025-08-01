import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-text-inverse hover:bg-primary-hover",
        secondary:
          "border-transparent bg-background-hover text-text-primary hover:bg-background-selected",
        destructive:
          "border-transparent bg-error text-text-inverse hover:bg-error/80",
        outline: "text-text-primary border border-border",
        success: "border-transparent bg-success-bg text-success-text",
        warning: "border-transparent bg-warning-bg text-warning-text",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.memo(function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
})

export { Badge, badgeVariants }