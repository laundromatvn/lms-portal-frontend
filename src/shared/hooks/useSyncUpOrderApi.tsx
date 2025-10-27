import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

export type SyncUpOrderResponse = any;

export async function syncUpOrderApi(orderId: string): Promise<SyncUpOrderResponse> {
  const url = `${getBackendUrl()}/api/v1/order/${orderId}/sync-up`

  const res = await axiosClient.post<SyncUpOrderResponse>(url.replace(getBackendUrl(), ''))
  return res.data as SyncUpOrderResponse
}

export const useSyncUpOrderApi = <T = SyncUpOrderResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const syncUpOrder = useCallback(async (orderId: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await syncUpOrderApi(orderId)
      setState({ data: data as T, loading: false, error: null })
      return data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) })
      throw error
    }
  }, [])

  return { ...state, syncUpOrder }
}
