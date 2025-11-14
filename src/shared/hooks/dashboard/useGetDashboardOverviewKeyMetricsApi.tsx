import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types'
import axiosClient from '@core/axiosClient'
import type { DashboardOverviewKeyMetrics } from '@shared/types/dashboard/DashboardOverviewKeyMetrics';

export type GetDashboardOverviewKeyMetricsRequest = {
  tenant_id?: string;
  store_id?: string;
}

export const useGetDashboardOverviewKeyMetricsApi = <T = DashboardOverviewKeyMetrics>() => {
  const [state, setState] = useState<ApiState<DashboardOverviewKeyMetrics>>({
    data: null,
    loading: false,
    error: null,
  });

  const getDashboardOverviewKeyMetrics = useCallback(async (params: GetDashboardOverviewKeyMetricsRequest) => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    const url = `${getBackendUrl()}/api/v1/dashboard/overview/key-metrics`

    try {
      const response = await axiosClient.get<DashboardOverviewKeyMetrics>(
        url.replace(getBackendUrl(), ''),
        { params }
      )

      setState({ data: response.data as DashboardOverviewKeyMetrics, loading: false, error: null });
      return response.data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) });
      throw error;
    }
  }, []);

  return { ...state, getDashboardOverviewKeyMetrics };
}
