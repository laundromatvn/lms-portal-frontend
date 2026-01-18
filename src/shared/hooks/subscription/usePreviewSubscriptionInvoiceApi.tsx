import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types'

import axiosClient from '@core/axiosClient'

export type PreviewSubscriptionInvoicePayload = {
  tenant_id: string;
  subscription_plan_id: string;
  pricing_option_id: string;
}

export type PreviewSubscriptionInvoiceResponse = {
  unit_count: number;
  base_amount: number;
  discount_amount: number;
  final_amount: number;
}

export const usePreviewSubscriptionInvoiceApi = <T = PreviewSubscriptionInvoiceResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const previewSubscriptionInvoice = useCallback(async (payload: PreviewSubscriptionInvoicePayload) => {
    setState({ data: null as T, loading: true, error: null });

    const url = `${getBackendUrl()}/api/v1/subscription/preview-invoice`

    try {
      const response = await axiosClient.post<T>(
        url.replace(getBackendUrl(), ''),
        payload
      )

      setState({ data: response.data as T, loading: false, error: null });
      return response.data as T
    } catch (error: any) {
      setState({ data: null as T, loading: false, error: new Error(error.message) });
      throw error;
    }
  }, []);

  return { ...state, previewSubscriptionInvoice };
}
