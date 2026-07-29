"use client"

import * as React from "react"
import { ThemeProvider as ThemeProviderPrimitive } from "next-themes"
import { cn } from "@/lib/utils"

function ThemeProvider({
  className,
  ...props
}: React.ComponentProps<typeof ThemeProviderPrimitive>) {
  return (
    <ThemeProviderPrimitive
      data-slot="theme-provider"
      className={cn("", className)}
      {...props}
    />
  )
}

export { ThemeProvider }