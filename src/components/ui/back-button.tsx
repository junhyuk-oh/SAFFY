"use client"

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BackButtonProps {
  href?: string
  label?: string
  variant?: 'link' | 'button'
  className?: string
}

export function BackButton({ 
  href, 
  label = '뒤로 가기', 
  variant = 'link',
  className = '' 
}: BackButtonProps) {
  const router = useRouter()

  const handleBack = () => {
    if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }

  if (variant === 'button') {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBack}
        className={`gap-2 ${className}`}
      >
        <ArrowLeft className="h-4 w-4" />
        {label}
      </Button>
    )
  }

  if (href) {
    return (
      <Link
        href={href}
        className={`inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors ${className}`}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {label}
      </Link>
    )
  }

  return (
    <button
      onClick={handleBack}
      className={`inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors ${className}`}
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      {label}
    </button>
  )
}