import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types'
import { type SubscriptionInvoice } from '@shared/types/subscription/SubscriptionInvoice';

import axiosClient from '@core/axiosClient'

export type ListSubscriptionInvoiceRequest = {
  page?: number;
  page_size?: number;
  search?: string;
  order_by?: string;
  order_direction?: 'asc' | 'desc';
  start_date?: string;
  end_date?: string;
}

export type ListSubscriptionInvoiceResponse = {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  data: SubscriptionInvoice[];
}

export const useListSubscriptionInvoiceApi = <T = ListSubscriptionInvoiceResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const listSubscriptionInvoice = useCallback(async (queryParams: ListSubscriptionInvoiceRequest) => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    const url = `${getBackendUrl()}/api/v1/subscription-invoice`

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

  return { ...state, listSubscriptionInvoice };
}
