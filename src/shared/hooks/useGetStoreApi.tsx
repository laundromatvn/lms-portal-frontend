import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

import { type Store } from '@shared/types/store';

export type GetStoreResponse = Store;

export async function getStoreApi(store_id: string): Promise<GetStoreResponse> {
  const url = `${getBackendUrl()}/api/v1/store/${store_id}`

  const res = await axiosClient.get<GetStoreResponse>(url.replace(getBackendUrl(), ''))
  return res.data as GetStoreResponse
}

export const useGetStoreApi = <T = GetStoreResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const getStore = useCallback(async (store_id: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await getStoreApi(store_id)
      setState({ data: data as T, loading: false, error: null })
      return data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) })
      throw error
    }
  }, [])

  return { ...state, getStore }
}
