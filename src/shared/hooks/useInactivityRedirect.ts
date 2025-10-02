import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

type UseInactivityRedirectOptions = {
  timeoutMs?: number;
  targetPath?: string;
  ignoreWhileMounted?: boolean;
};

const DEFAULT_TIMEOUT_MS = 90_000; // 90 seconds
const DEFAULT_TARGET = '/customer-flow/welcome';

/**
 * Redirects to targetPath after no user interaction for timeoutMs.
 * Resets on touch, click, key, and scroll events.
 */
export function useInactivityRedirect(options?: UseInactivityRedirectOptions): void {
  const navigate = useNavigate();
  const timerRef = useRef<number | null>(null);
  const resetCountRef = useRef<number>(0);
  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const targetPath = options?.targetPath ?? DEFAULT_TARGET;

  useEffect(() => {
    let isMounted = true;

    const resetTimer = () => {
      if (!isMounted) return;

      if (timerRef.current) window.clearTimeout(timerRef.current);

      timerRef.current = window.setTimeout(() => {
        console.log(`[inactivity] redirecting to ${targetPath} after ${timeoutMs}ms of inactivity (resets: ${resetCountRef.current})`);
        navigate(targetPath, { replace: true });
      }, timeoutMs);

      resetCountRef.current += 1;
      console.log(`[inactivity] reset timer #${resetCountRef.current} (timeout=${timeoutMs}ms)`);
    };

    const handleEvent = () => {
      resetTimer();
    };

    // Consider common interactions on touch screens and kiosks
    const events: (keyof DocumentEventMap)[] = [
      'touchstart',
      'touchmove',
      'keydown',
      'scroll',
    ];

    events.forEach((eventName) => {
      window.addEventListener(eventName, handleEvent, { passive: true });
    });

    resetTimer();

    return () => {
      isMounted = false;
      if (timerRef.current) window.clearTimeout(timerRef.current);
      events.forEach((eventName) => {
        window.removeEventListener(eventName, handleEvent as EventListener);
      });
    };
  }, [navigate, targetPath, timeoutMs]);
}
