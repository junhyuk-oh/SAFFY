"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface FormFieldProps {
  children: ReactNode
  className?: string
}

export function FormField({ children, className }: FormFieldProps) {
  return (
    <div className={cn("mb-6", className)}>
      {children}
    </div>
  )
}

interface FormGroupProps {
  children: ReactNode
  className?: string
}

export function FormGroup({ children, className }: FormGroupProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6", className)}>
      {children}
    </div>
  )
}

interface FormSectionProps {
  title?: string
  description?: string
  children: ReactNode
  className?: string
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <div className={cn("mb-8", className)}>
      {title && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
          {description && (
            <p className="text-sm text-text-secondary">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  )
}

interface FormErrorProps {
  message?: string
  className?: string
}

export function FormError({ message, className }: FormErrorProps) {
  if (!message) return null
  
  return (
    <p className={cn("text-error text-sm mt-1", className)}>
      {message}
    </p>
  )
}

interface FormHelperTextProps {
  children: ReactNode
  className?: string
}

export function FormHelperText({ children, className }: FormHelperTextProps) {
  return (
    <p className={cn("text-text-secondary text-sm mt-1", className)}>
      {children}
    </p>
  )
}

interface FormActionsProps {
  children: ReactNode
  className?: string
  align?: "left" | "right" | "center" | "between"
}

export function FormActions({ children, className, align = "right" }: FormActionsProps) {
  const alignClasses = {
    left: "justify-start",
    right: "justify-end",
    center: "justify-center",
    between: "justify-between"
  }

  return (
    <div className={cn(
      "flex items-center gap-3 pt-6 border-t border-border",
      alignClasses[align],
      className
    )}>
      {children}
    </div>
  )
}