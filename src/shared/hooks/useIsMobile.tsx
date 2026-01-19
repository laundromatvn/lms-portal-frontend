import { useEffect, useState } from 'react';

/**
 * Custom hook to detect if the current screen is mobile
 * Uses a breakpoint of 768px (medium breakpoint from theme)
 * 
 * @returns {boolean} true if screen width is less than 768px, false otherwise
 */
export const useIsMobile = (): boolean => {
  // Initialize with correct value synchronously to prevent flash on first render
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false; // Default to desktop for SSR
    }
    return window.innerWidth < 768;
  });

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Add event listener for window resize
    window.addEventListener('resize', checkIsMobile);

    // Cleanup event listener on unmount
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
};
