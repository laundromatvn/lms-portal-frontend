import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

import { type Machine } from '@shared/types/machine';
import { MachineTypeEnum } from '@shared/enums/MachineTypeEnum';

export type UpdateMachineRequest = {
  name: string;
  machine_type: MachineTypeEnum;
  base_price: string;
  status: string;
  pulse_duration: number;
  pulse_interval: number;
  coin_value: number;
}

export type UpdateMachineResponse = Machine;

export async function updateMachineApi(machine_id: string, payload: UpdateMachineRequest): Promise<UpdateMachineResponse> {
  const url = `${getBackendUrl()}/api/v1/machine/${machine_id}`
  const body = {
    name: payload.name,
    machine_type: payload.machine_type,
    base_price: payload.base_price,
    status: payload.status,
    pulse_duration: payload.pulse_duration,
    pulse_interval: payload.pulse_interval,
    coin_value: payload.coin_value,
  }
  const res = await axiosClient.patch<UpdateMachineResponse>(url.replace(getBackendUrl(), ''), body)
  return res.data as UpdateMachineResponse
}

export const useUpdateMachineApi = <T = UpdateMachineResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const updateMachine = useCallback(async (machine_id: string, payload: UpdateMachineRequest) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await updateMachineApi(machine_id, payload)
      setState({ data: data as T, loading: false, error: null })
      return data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) })
      throw error
    }
  }, [])

  return { ...state, updateMachine }
}


