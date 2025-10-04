import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

import { type Machine } from '@shared/types/machine';

export type GetMachineResponse = Machine;

export async function getMachineApi(machine_id: string): Promise<GetMachineResponse> {
  const url = `${getBackendUrl()}/api/v1/machine/${machine_id}`

  const res = await axiosClient.get<GetMachineResponse>(url.replace(getBackendUrl(), ''))
  return res.data as GetMachineResponse
}

export const useGetMachineApi = <T = GetMachineResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const getMachine = useCallback(async (machine_id: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await getMachineApi(machine_id)
      setState({ data: data as T, loading: false, error: null })
      return data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) })
      throw error
    }
  }, [])

  return { ...state, getMachine }
}
