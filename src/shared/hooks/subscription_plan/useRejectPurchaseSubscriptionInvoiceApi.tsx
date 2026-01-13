import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types'

import axiosClient from '@core/axiosClient'

export type RejectPurchaseSubscriptionInvoiceResponse = boolean;

export const useRejectPurchaseSubscriptionInvoiceApi = <T = RejectPurchaseSubscriptionInvoiceResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const rejectPurchaseSubscriptionInvoice = useCallback(async (invoice_id: string) => {
    setState({ data: false as T, loading: true, error: null });

    const url = `${getBackendUrl()}/api/v1/subscription-invoice/${invoice_id}/reject-purchase`

    try {
      await axiosClient.post<T>(
        url.replace(getBackendUrl(), ''),
      )

      setState({ data: true as T, loading: false, error: null });
      return true as T
    } catch (error: any) {
      setState({ data: false as T, loading: false, error: new Error(error.message) });
      throw error;
    }
  }, []);

  return { ...state, rejectPurchaseSubscriptionInvoice };
}
