import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types'

import axiosClient from '@core/axiosClient'

import type { OverviewStoreKeyMetrics } from '@shared/types/dashboard/OverviewStoreKeyMetrics';

export type GetOverviewStoreKeyMetricsRequest = {
  tenant_id?: string;
  store_id?: string;
}

export type GetOverviewStoreKeyMetricsResponse = {
  store_key_metrics: OverviewStoreKeyMetrics[];
}

export const useGetOverviewStoreKeyMetricsApi = <T = GetOverviewStoreKeyMetricsResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

    const getOverviewStoreKeyMetrics = useCallback(async (params: GetOverviewStoreKeyMetricsRequest) => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    const url = `${getBackendUrl()}/api/v1/dashboard/overview/store-key-metrics`

    try {
      const response = await axiosClient.get<T>(url.replace(getBackendUrl(), ''), { params })

      setState({ data: response.data as T, loading: false, error: null });
      return response.data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) });
      throw error;
    }
  }, []);

  return { ...state, getOverviewStoreKeyMetrics };
}
