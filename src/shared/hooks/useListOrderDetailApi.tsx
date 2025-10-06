import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types';

import axiosClient from '@core/axiosClient';

import { type OrderDetail } from '@shared/types/OrderDetail';

export type ListOrderDetailRequest = {
  order_id: string;
  page: number;
  page_size: number;
}

export type ListOrderDetailResponse = {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  data: OrderDetail[];
}

export const useListOrderDetailApi = <T = ListOrderDetailResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const listOrderDetail = useCallback(async ({ order_id, page = 1, page_size = 10 }: ListOrderDetailRequest) => {
      setState(prevState => ({ ...prevState, loading: true, error: null }));

    const url = `${getBackendUrl()}/api/v1/order/details`

    let queryParams = {
      page,
      page_size,
    } as Record<string, any>;

    if (order_id) {
      queryParams.order_id = order_id;
    }

    try {
      const response = await axiosClient.get<T>(
        url.replace(getBackendUrl(), ''),
        { params: { ...queryParams } }
      )

      setState({ data: response.data as T, loading: false, error: null });
      return response.data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) });
      throw error;
    }
  }, [setState]);

  return { ...state, listOrderDetail };
}
