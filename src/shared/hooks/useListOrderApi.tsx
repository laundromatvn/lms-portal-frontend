import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types';

import axiosClient from '@core/axiosClient';

import { type Order } from '@shared/types/Order';

export type ListOrderRequest = {
  tenant_id?: string;
  page: number;
  page_size: number;
}

export type ListOrderResponse = {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  data: Order[];
}

export const useListOrderApi = <T = ListOrderResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const listOrder = useCallback(async ({ tenant_id, page = 1, page_size = 10 }: ListOrderRequest) => {
      setState(prevState => ({ ...prevState, loading: true, error: null }));

    const url = `${getBackendUrl()}/api/v1/order`

    let queryParams = {
      page,
      page_size,
    } as Record<string, any>;

    if (tenant_id) {
      queryParams.tenant_id = tenant_id;
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

  return { ...state, listOrder };
}
