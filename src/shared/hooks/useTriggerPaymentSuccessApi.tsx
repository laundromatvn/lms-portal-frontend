import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

export type TriggerPaymentSuccessResponse = any;

export async function triggerPaymentSuccessApi(order_id: string): Promise<TriggerPaymentSuccessResponse> {
  const url = `${getBackendUrl()}/api/v1/order/${order_id}/trigger-payment-success`

  const res = await axiosClient.post<TriggerPaymentSuccessResponse>(url.replace(getBackendUrl(), ''))
  return res.data as TriggerPaymentSuccessResponse
}

export const useTriggerPaymentSuccessApi = <T = TriggerPaymentSuccessResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const triggerPaymentSuccess = useCallback(async (order_id: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await triggerPaymentSuccessApi(order_id)
      setState({ data: data as T, loading: false, error: null })
      return data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) })
      throw error
    }
  }, [])

  return { ...state, triggerPaymentSuccess }
}
