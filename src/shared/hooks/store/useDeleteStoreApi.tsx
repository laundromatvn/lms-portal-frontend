import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

export type DeleteStoreResponse = boolean;

export async function deleteStoreApi(storeId: string): Promise<DeleteStoreResponse> {
  const url = `${getBackendUrl()}/api/v1/store/${storeId}`

  const res = await axiosClient.delete<DeleteStoreResponse>(
    url.replace(getBackendUrl(), ''),
  )
  return res.data as DeleteStoreResponse
}

export const useDeleteStoreApi = <T = DeleteStoreResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null
  })

  const deleteStore = useCallback(async (storeId: string) => {
    setState({ data: false as T, loading: true, error: null })
    try {
      const data = await deleteStoreApi(storeId)
      setState({ data: true as T, loading: false, error: null })
      return data as T
    } catch (error: any) {
      setState({ data: false as T, loading: false, error: new Error(error.message) })
      throw error
    }
  }, [])

  return { ...state, deleteStore }
}
