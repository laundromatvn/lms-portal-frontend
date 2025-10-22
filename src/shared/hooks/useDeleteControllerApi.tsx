import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

export type DeleteControllerResponse = boolean;

export async function deleteControllerApi(controllerId: string): Promise<boolean> {
  const url = `${getBackendUrl()}/api/v1/controller/${controllerId}`
  const res = await axiosClient.delete<boolean>(url.replace(getBackendUrl(), ''))
  return res.data as boolean
}

export const useDeleteControllerApi = <T = boolean>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const deleteController = useCallback(async (controllerId: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      await deleteControllerApi(controllerId)
      setState({ data: true as T, loading: false, error: null })
      return true as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) })
      throw error
    }
  }, [])

  return { ...state, deleteController }
}
