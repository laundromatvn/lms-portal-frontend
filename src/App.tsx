import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { ThemeProvider } from '@shared/theme/ThemeProvider';
import { PermissionProvider } from '@shared/contexts/PermissionContext';
import { tokenManager } from '@core/auth/tokenManager';
import { PROACTIVE_REFRESH_CHECK_INTERVAL_MS, FORCE_ACCESS_REFRESH_INTERVAL_MS, FORCE_REFRESH_ROTATION_INTERVAL_MS } from '@core/constant';

import AppRouter from './router';
import { routes } from './router/routes';

const App: React.FC = () => {
  const proactiveIdRef = useRef<number | null>(null);
  const forceAccessIdRef = useRef<number | null>(null);
  const rotateRefreshIdRef = useRef<number | null>(null);

  useEffect(() => {

    const startIntervals = () => {
      if (proactiveIdRef.current !== null) return;
      proactiveIdRef.current = window.setInterval(() => {
        tokenManager.proactiveRefresh();
      }, PROACTIVE_REFRESH_CHECK_INTERVAL_MS);

      forceAccessIdRef.current = window.setInterval(() => {
        tokenManager.refreshAccessNow();
      }, FORCE_ACCESS_REFRESH_INTERVAL_MS);

      rotateRefreshIdRef.current = window.setInterval(() => {
        tokenManager.rotateRefreshTokenNow();
      }, FORCE_REFRESH_ROTATION_INTERVAL_MS);
    };

    const stopIntervals = () => {
      if (proactiveIdRef.current !== null) {
        clearInterval(proactiveIdRef.current);
        proactiveIdRef.current = null;
      }
      if (forceAccessIdRef.current !== null) {
        clearInterval(forceAccessIdRef.current);
        forceAccessIdRef.current = null;
      }
      if (rotateRefreshIdRef.current !== null) {
        clearInterval(rotateRefreshIdRef.current);
        rotateRefreshIdRef.current = null;
      }
    };

    const unsubscribe = tokenManager.subscribeAuth((authenticated) => {
      if (authenticated) {
        startIntervals();
      } else {
        stopIntervals();
      }
    });

    return () => {
      stopIntervals();
      unsubscribe();
    };
  }, []);

  return (
    <Router>
      <ThemeProvider>
        <PermissionProvider>
          <AppRouter routes={routes} />
        </PermissionProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;