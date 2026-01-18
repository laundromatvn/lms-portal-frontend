import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { tokenManager } from '@core/auth/tokenManager';
import { userStorage } from '@core/storage/userStorage';

import { UserRoleEnum } from '@shared/enums/UserRoleEnum';

import {
  useGetCurrentTenantSubscriptionApi,
  type GetCurrentTenantSubscriptionResponse,
} from '@shared/hooks/user/useGetCurrentTenantSubscriptionApi';

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
 */
export const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isChecking, setIsChecking] = useState(true);

  const {
    getCurrentTenantSubscription,
    loading: currentTenantSubscriptionLoading,
    data: currentTenantSubscriptionData,
    error: currentTenantSubscriptionError,
  } = useGetCurrentTenantSubscriptionApi<GetCurrentTenantSubscriptionResponse>();

  // Routes that should never be blocked by subscription guard
  const isAllowedRoute = (pathname: string): boolean => {
    return ALLOWED_ROUTES.some(route => pathname === route || pathname.startsWith(route));
  };

  useEffect(() => {
    const checkSubscription = async () => {
      // Skip check if user is not authenticated
      if (!tokenManager.isAuthenticated()) {
        setIsChecking(false);
        return;
      }

      // SKip if current user is admin
      if (userStorage.load()?.role === UserRoleEnum.ADMIN) {
        setIsChecking(false);
        return;
      }

      // Skip check for allowed routes to prevent redirect loops
      if (isAllowedRoute(location.pathname)) {
        setIsChecking(false);
        return;
      }

      // Fetch current subscription status
      getCurrentTenantSubscription();
    };

    checkSubscription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    if (!currentTenantSubscriptionData || currentTenantSubscriptionLoading || currentTenantSubscriptionError) {
      return;
    }

    if (currentTenantSubscriptionData.should_block_access === true) {
      if (currentTenantSubscriptionData.is_trial === true) {
        navigate('/subscription/trial-ended', { replace: true });
      } else {
        navigate('/subscription/expired', { replace: true });
      }
    }

    setIsChecking(false);
  }, [currentTenantSubscriptionData]);

  if (isChecking || currentTenantSubscriptionLoading) {
    return null;
  }

  if (currentTenantSubscriptionError) {
    navigate('/error');
    return null;
  }

  return <>{children}</>;
};
