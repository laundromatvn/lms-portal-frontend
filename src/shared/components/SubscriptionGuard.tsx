import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { tokenManager } from '@core/auth/tokenManager';
import { tenantStorage } from '@core/storage/tenantStorage';
import { userStorage } from '@core/storage/userStorage';

import { UserRoleEnum } from '@shared/enums/UserRoleEnum';

import {
  useGetTenantSubscriptionExpiryStatus,
  type GetTenantSubscriptionExpiryStatusResponse,
} from '@shared/hooks/tenant/useGetTenantSubscriptionExpiryStatus';

const ALLOWED_ROUTES = [
  '/auth/sign-in',
  '/auth/generate-otp',
  '/auth/verify-otp',
  '/subscription/expired',
  '/subscription/trial-ended',
  '/subscription/renew',
];

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

/**
 * SubscriptionGuard - Global guard that blocks access when subscription/trial has ended
 * 
 * This guard:
 * - Runs on every route navigation, page refresh, and direct URL access
 * - Uses useGetCurrentTenantSubscriptionApi as the single source of truth
 * - Redirects to appropriate pages when should_block_access is true
 * - Does NOT block access to login or subscription-related pages
 * - Keeps children rendered during checks to prevent layout flashing
 */
export const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isChecking, setIsChecking] = useState(true);
  const [hasInitiallyChecked, setHasInitiallyChecked] = useState(false);
  const previousChildrenRef = useRef<React.ReactNode>(children);

  const tenantId = tenantStorage.load()?.id;

  const {
    getTenantSubscriptionExpiryStatus,
    loading: tenantSubscriptionExpiryStatusLoading,
    data: tenantSubscriptionExpiryStatusData,
    error: tenantSubscriptionExpiryStatusError,
  } = useGetTenantSubscriptionExpiryStatus<GetTenantSubscriptionExpiryStatusResponse>();

  // Routes that should never be blocked by subscription guard
  const isAllowedRoute = (pathname: string): boolean => {
    return ALLOWED_ROUTES.some(route => pathname === route || pathname.startsWith(route));
  };

  // Reset state when user logs out
  useEffect(() => {
    const unsubscribe = tokenManager.subscribeAuth((authenticated) => {
      if (!authenticated) {
        setIsChecking(true);
        setHasInitiallyChecked(false);
        previousChildrenRef.current = null;
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const checkSubscription = async () => {
      // Skip check if user is not authenticated
      if (!tokenManager.isAuthenticated()) {
        setIsChecking(false);
        setHasInitiallyChecked(true);
        return;
      }

      // SKip if current user is admin
      if (userStorage.load()?.role === UserRoleEnum.ADMIN) {
        setIsChecking(false);
        setHasInitiallyChecked(true);
        return;
      }

      // Skip check for allowed routes to prevent redirect loops
      if (isAllowedRoute(location.pathname)) {
        setIsChecking(false);
        setHasInitiallyChecked(true);
        return;
      }

      // Fetch current subscription status
      getTenantSubscriptionExpiryStatus(tenantId!);
    };

    checkSubscription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, tenantId]);

  useEffect(() => {
    if (!tenantSubscriptionExpiryStatusData) {
      return;
    }

    // Don't redirect if we're on an allowed route (like renew page)
    if (isAllowedRoute(location.pathname)) {
      setIsChecking(false);
      setHasInitiallyChecked(true);
      return;
    }

    if (tenantSubscriptionExpiryStatusData.should_block_access === true) {
      navigate('/subscription/expired', { replace: true });
    }

    setIsChecking(false);
    setHasInitiallyChecked(true);
  }, [tenantSubscriptionExpiryStatusData, navigate, location.pathname]);

  // Keep previous children rendered during checks to prevent layout flash
  // Only return null on initial mount before first check completes
  if (!hasInitiallyChecked && (isChecking || tenantSubscriptionExpiryStatusLoading)) {
    return null;
  }

  // After initial check, always render children to prevent flashing on navigation
  // The navigation will handle redirecting if subscription is expired
  if (hasInitiallyChecked) {
    previousChildrenRef.current = children;
    return <>{children}</>;
  }

  if (tenantSubscriptionExpiryStatusError) {
    navigate('/error');
    return null;
  }

  return <>{previousChildrenRef.current || children}</>;
};
