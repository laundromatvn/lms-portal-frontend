import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types';

import axiosClient from '@core/axiosClient';

export type GetOrderByDayBarChartRequest = {
  tenant_id: string;
}

export type GetOrderByDayBarChartResponse = {
  labels: string[];
  values: number[];
}

export const useGetOrderByDayBarChartApi = <T = GetOrderByDayBarChartResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const getOrderByDayBarChart = useCallback(async ({ tenant_id }: GetOrderByDayBarChartRequest) => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    const url = `${getBackendUrl()}/api/v1/dashboard/overview/order-by-day-bar-chart`

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

  return { ...state, getOrderByDayBarChart };
}
