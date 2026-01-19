import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Tag,
  Spin,
} from 'antd';

import { useTheme } from '@shared/theme/useTheme';

import { tenantStorage } from '@core/storage/tenantStorage';

import {
  useGetTenantSubscriptionExpiryStatus,
  type GetTenantSubscriptionExpiryStatusResponse
} from '@shared/hooks/tenant/useGetTenantSubscriptionExpiryStatus';

const DAY_BEFORE_EXPIRATION = 7;
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

// Module-level cache to persist across component unmounts/remounts
const cacheRef: {
  data: GetTenantSubscriptionExpiryStatusResponse | null;
  timestamp: number | null;
  tenantId: string | null;
} = {
  data: null,
  timestamp: null,
  tenantId: null,
};

export const SubscriptionExpiryWarning: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const tenantId = tenantStorage.load()?.id;
  const [cachedData, setCachedData] = useState<GetTenantSubscriptionExpiryStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    getTenantSubscriptionExpiryStatus,
    data: subscriptionExpiryStatusData,
    loading: subscriptionExpiryStatusLoading,
  } = useGetTenantSubscriptionExpiryStatus<GetTenantSubscriptionExpiryStatusResponse>();

  useEffect(() => {
    if (!tenantId) return;

    // Check if we have valid cached data for this tenant
    const now = Date.now();
    const isCacheValid =
      cacheRef.data &&
      cacheRef.timestamp &&
      cacheRef.tenantId === tenantId &&
      (now - cacheRef.timestamp) < CACHE_DURATION_MS;

    if (isCacheValid) {
      // Use cached data
      setCachedData(cacheRef.data);
      setIsLoading(false);
      return;
    }

    // Cache miss or expired, fetch fresh data
    setIsLoading(true);
    getTenantSubscriptionExpiryStatus(tenantId).then((data) => {
      // Update cache
      cacheRef.data = data;
      cacheRef.timestamp = Date.now();
      cacheRef.tenantId = tenantId;
      setCachedData(data);
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  }, [tenantId, getTenantSubscriptionExpiryStatus]);

  // Use cached data if available, otherwise use hook data
  const displayData = cachedData || subscriptionExpiryStatusData;
  const displayLoading = isLoading || subscriptionExpiryStatusLoading;

  if (displayData?.days_until_expiration === undefined || displayLoading) {
    return <Spin size="small" />;
  }

  if (displayData?.days_until_expiration > DAY_BEFORE_EXPIRATION) {
    return null;
  }

  return (
    <Tag
      color={displayData?.days_until_expiration > 0 ? 'warning' : 'error'}
      onClick={() => navigate(`/tenants/${tenantId}/detail#subscription`)}
      style={{
        cursor: 'pointer',
      }}
    >
      <Trans
        i18nKey={displayData?.days_until_expiration > 0
          ? 'subscription.subscriptionWillExpireIn'
          : 'subscription.subscriptionHasExpired'
        }
        values={{
          planName: displayData?.subscription_plan_name || '',
          days: Math.abs(displayData?.days_until_expiration || 0),
        }}
        components={{
          strong: <span style={{
            fontSize: theme.custom.fontSize.xsmall,
            fontWeight: 'bold',
          }} />
        }}

      />
    </Tag>
  )
};
