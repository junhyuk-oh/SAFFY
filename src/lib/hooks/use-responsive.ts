"use client"

import { useState, useEffect } from "react"

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    setMatches(media.matches)

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [query])

  return matches
}

export function useBreakpoint() {
  const isSm = useMediaQuery(`(min-width: ${breakpoints.sm}px)`)
  const isMd = useMediaQuery(`(min-width: ${breakpoints.md}px)`)
  const isLg = useMediaQuery(`(min-width: ${breakpoints.lg}px)`)
  const isXl = useMediaQuery(`(min-width: ${breakpoints.xl}px)`)
  const is2xl = useMediaQuery(`(min-width: ${breakpoints["2xl"]}px)`)

  return {
    isSm,
    isMd,
    isLg,
    isXl,
    is2xl,
    // 편의 메서드
    isMobile: !isMd,
    isTablet: isMd && !isLg,
    isDesktop: isLg,
  }
}

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return windowSize
}