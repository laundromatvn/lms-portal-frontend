import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types';

import axiosClient from '@core/axiosClient';

export type GetRevenueByDayBarChartRequest = {
  tenant_id: string;
}

export type GetRevenueByDayBarChartResponse = {
  labels: string[];
  values: number[];
}

export const useGetRevenueByDayBarChartApi = <T = GetRevenueByDayBarChartResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const getRevenueByDayBarChart = useCallback(async ({ tenant_id }: GetRevenueByDayBarChartRequest) => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    const url = `${getBackendUrl()}/api/v1/dashboard/overview/revenue-by-day-bar-chart`

    const queryParams = {
      tenant_id,
    }

    try {
      const response = await axiosClient.get<T>(
        url.replace(getBackendUrl(), ''),
        { params: queryParams }
      )

      setState({ data: response.data as T, loading: false, error: null });
      return response.data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) });
      throw error;
    }
  }, [setState]);

  return { ...state, getRevenueByDayBarChart };
}
