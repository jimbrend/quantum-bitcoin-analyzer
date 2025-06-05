import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-orange-500/30 bg-orange-500/30 text-orange-200 hover:bg-orange-500/40",
        secondary:
          "border-orange-500/20 bg-orange-500/20 text-orange-200 hover:bg-orange-500/30",
        destructive:
          "border-red-500/30 bg-red-500/30 text-red-200 hover:bg-red-500/40",
        outline: "text-orange-200 border-orange-500/30",
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

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
