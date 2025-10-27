import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types';

import axiosClient from '@core/axiosClient';

import { type Order } from '@shared/types/Order';
import { OrderStatusEnum } from '@shared/enums/OrderStatusEnum';
import { PaymentStatusEnum } from '@shared/enums/PaymentStatusEnum';

export type ListOrderRequest = {
  tenant_id?: string;
  status?: OrderStatusEnum;
  payment_status?: PaymentStatusEnum;
  query?: string;
  page: number;
  page_size: number;
  order_by?: string;
  order_direction?: 'asc' | 'desc';
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

  const listOrder = useCallback(async ({ tenant_id, status, payment_status, query, page = 1, page_size = 10, order_by, order_direction }: ListOrderRequest) => {
      setState(prevState => ({ ...prevState, loading: true, error: null }));

    const url = `${getBackendUrl()}/api/v1/order`

    let queryParams = {
      page,
      page_size,
    } as Record<string, any>;

    if (tenant_id) {
      queryParams.tenant_id = tenant_id;
    }

    if (status) {
      queryParams.status = status;
    }

    if (payment_status) {
      queryParams.payment_status = payment_status;
    }

    if (query) {
      queryParams.query = query;
    }

    if (order_by) {
      queryParams.order_by = order_by;
    }

    if (order_direction) {
      queryParams.order_direction = order_direction;
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
