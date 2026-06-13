"use client";

import { useEffect, useState } from "react";

/**
 * Returns true once the page is scrolled past `threshold` px.
 * Ports the navbar "scrolled" behaviour from the original CRA app.
 */
export function useScrolled(threshold = 50): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}
