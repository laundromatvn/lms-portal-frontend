import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

export type StartMachineResponse = any;

export async function startMachineApi(machineId: string, total_amount: number): Promise<StartMachineResponse> {
  const url = `${getBackendUrl()}/api/v1/machine/${machineId}/start`
  const payload = {
    total_amount,
  }

  const res = await axiosClient.post<StartMachineResponse>(url.replace(getBackendUrl(), ''), payload)
  return res.data as StartMachineResponse
}

export const useStartMachineApi = <T = StartMachineResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const startMachine = useCallback(async (machineId: string, total_amount: number) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await startMachineApi(machineId, total_amount)
      setState({ data: data as T, loading: false, error: null })
      return data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) })
      throw error
    }
  }, [])

  return { ...state, startMachine }
}
