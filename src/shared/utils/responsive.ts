/**
 * Utility functions for responsive design and mobile detection
 */

/**
 * Check if the current screen is mobile based on window width
 * Uses a breakpoint of 768px (medium breakpoint from theme)
 * 
 * @returns {boolean} true if screen width is less than 768px, false otherwise
 */
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') {
    return false; // Default to desktop for SSR
  }
  return window.innerWidth < 768;
};

/**
 * Check if the current screen is desktop based on window width
 * Uses a breakpoint of 768px (medium breakpoint from theme)
 * 
 * @returns {boolean} true if screen width is 768px or greater, false otherwise
 */
export const isDesktop = (): boolean => {
  return !isMobile();
};

/**
 * Get the current screen width
 * 
 * @returns {number} current window inner width
 */
export const getScreenWidth = (): number => {
  if (typeof window === 'undefined') {
    return 1024; // Default desktop width for SSR
  }
  return window.innerWidth;
};

/**
 * Check if the current screen matches a specific breakpoint
 * 
 * @param breakpoint - The breakpoint to check against
 * @returns {boolean} true if current width is less than the breakpoint
 */
export const isBelowBreakpoint = (breakpoint: number): boolean => {
  return getScreenWidth() < breakpoint;
};

/**
 * Check if the current screen is above a specific breakpoint
 * 
 * @param breakpoint - The breakpoint to check against
 * @returns {boolean} true if current width is greater than or equal to the breakpoint
 */
export const isAboveBreakpoint = (breakpoint: number): boolean => {
  return getScreenWidth() >= breakpoint;
};
