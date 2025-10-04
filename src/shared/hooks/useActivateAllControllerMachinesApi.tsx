import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

export type ActivateAllControllerMachinesResponse = any;

export async function activateAllControllerMachinesApi(controller_id: string): Promise<ActivateAllControllerMachinesResponse> {
  const url = `${getBackendUrl()}/api/v1/controller/${controller_id}/activate-machines`

  const res = await axiosClient.post<ActivateAllControllerMachinesResponse>(url.replace(getBackendUrl(), ''))
  return res.data as ActivateAllControllerMachinesResponse
}

export const useActivateAllControllerMachinesApi = <T = ActivateAllControllerMachinesResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const activateAllControllerMachines = useCallback(async (controller_id: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await activateAllControllerMachinesApi(controller_id)
      setState({ data: data as T, loading: false, error: null })
      return data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) })
      throw error
    }
  }, [])

  return { ...state, activateAllControllerMachines }
}
