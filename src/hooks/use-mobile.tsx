import * as React from "react"

/**
 * use-mobile.tsx
 *
 * Custom React hook to detect mobile viewport.
 * - Returns true if window width is below MOBILE_BREAKPOINT
 * - Listens for viewport changes and updates state
 *
 * Dependencies:
 * - React: useState, useEffect
 *
 * NOTE: Used for responsive UI logic throughout the app.
 * TODO: Make breakpoint configurable via context or props.
 */

// Mobile breakpoint in pixels (default: 768px)
const MOBILE_BREAKPOINT = 768

/**
 * useIsMobile
 * @returns {boolean} True if viewport is mobile-sized
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Media query for mobile breakpoint
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // Always return a boolean
  return !!isMobile
}
