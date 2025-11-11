import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

export type DeleteFirmwareResponse = boolean;

export async function deleteFirmwareApi(firmwareId: string): Promise<boolean> {
  const url = `${getBackendUrl()}/api/v1/firmware/${firmwareId}`
  const res = await axiosClient.delete<boolean>(url.replace(getBackendUrl(), ''))
  return res.data as boolean
}

export const useDeleteFirmwareApi = <T = DeleteFirmwareResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const deleteFirmware = useCallback(async (firmwareId: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const response = await deleteFirmwareApi(firmwareId)
      setState({ data: response as T, loading: false, error: null })
      return true as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) })
      throw error
    }
  }, []);

  return { ...state, deleteFirmware };
}
