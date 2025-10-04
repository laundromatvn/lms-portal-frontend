import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

export type ActivateMachineResponse = any;

export async function activateMachineApi(machine_id: string): Promise<ActivateMachineResponse> {
  const url = `${getBackendUrl()}/api/v1/machine/${machine_id}/activate`

  const res = await axiosClient.post<ActivateMachineResponse>(url.replace(getBackendUrl(), ''))
  return res.data as ActivateMachineResponse
}

export const useActivateMachineApi = <T = ActivateMachineResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const activateMachine = useCallback(async (machine_id: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await activateMachineApi(machine_id)
      setState({ data: data as T, loading: false, error: null })
      return data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) })
      throw error
    }
  }, [])

  return { ...state, activateMachine }
}
