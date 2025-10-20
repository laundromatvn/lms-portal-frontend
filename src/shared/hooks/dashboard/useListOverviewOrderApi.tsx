import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types'

import axiosClient from '@core/axiosClient'

import { OrderStatusEnum } from '@shared/enums/OrderStatusEnum';
import { PaymentStatusEnum } from '@shared/enums/PaymentStatusEnum';
import type { OverviewOrder } from '@shared/types/dashboard/OverviewOrder';

export type ListOverviewOrderRequest = {
  tenant_id?: string;
  store_id?: string;
  status?: OrderStatusEnum;
  start_date?: string;
  end_date?: string;
  payment_status?: PaymentStatusEnum;
  query?: string;
  order_by?: string;
  order_direction?: 'asc' | 'desc';
}

export type ListOverviewOrderResponse = {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  data: OverviewOrder[];
}

export const useListOverviewOrderApi = <T = ListOverviewOrderResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const listOverviewOrder = useCallback(async ({ tenant_id, store_id, status, start_date, end_date, payment_status, query, order_by, order_direction }: ListOverviewOrderRequest) => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    const url = `${getBackendUrl()}/api/v1/dashboard/overview/order`

    const queryParams = { tenant_id, store_id, status, start_date, end_date, payment_status, query, order_by, order_direction }

    try {
      const response = await axiosClient.get<T>(url.replace(getBackendUrl(), ''), { params: queryParams })

      setState({ data: response.data as T, loading: false, error: null });
      return response.data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) });
      throw error;
    }
  }, []);

  return { ...state, listOverviewOrder };
}
