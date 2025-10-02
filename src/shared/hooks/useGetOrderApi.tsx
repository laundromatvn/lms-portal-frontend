import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

import { type Order } from '@shared/types/Order';

export type GetOrderResponse = Order;

export async function getOrderApi(order_id: string): Promise<GetOrderResponse> {
  const url = `${getBackendUrl()}/api/v1/order/${order_id}`

  const res = await axiosClient.get<GetOrderResponse>(url.replace(getBackendUrl(), ''))
  return res.data as GetOrderResponse
}

export const useGetOrderApi = <T = GetOrderResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const getOrder = useCallback(async (order_id: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await getOrderApi(order_id)
      setState({ data: data as T, loading: false, error: null })
      return data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) })
      throw error
    }
  }, [])

  return { ...state, getOrder }
}
