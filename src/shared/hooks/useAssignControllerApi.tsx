import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

import { ControllerStatusEnum } from '@shared/enums/ControllerStatusEnum';
import { type Controller } from '@shared/types/Controller';

export type AssignControllerRequest = {
  device_id: string;
  name: string;
  total_relays: number;
  store_id: string;
}

export type AssignControllerResponse = Controller;

export async function assignControllerApi(payload: AssignControllerRequest): Promise<AssignControllerResponse> {
  const url = `${getBackendUrl()}/api/v1/controller/abandoned/assign`
  const data = {
    device_id: payload.device_id,
    name: payload.name,
    total_relays: payload.total_relays,
    status: ControllerStatusEnum.NEW,
    store_id: payload.store_id,
  }

  const res = await axiosClient.post<AssignControllerResponse>(url.replace(getBackendUrl(), ''), data)
  return res.data as AssignControllerResponse
}

export const useAssignControllerApi = <T = AssignControllerResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const assignController = useCallback(async (payload: AssignControllerRequest) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await assignControllerApi(payload)
      setState({ data: data as T, loading: false, error: null })
      return data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) })
      throw error
    }
  }, [])

  return { ...state, assignController }
}
