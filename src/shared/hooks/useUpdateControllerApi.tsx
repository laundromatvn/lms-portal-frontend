import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

import { type Controller } from '@shared/types/Controller';

export type UpdateControllerRequest = {
  name: string;
  total_relays: number;
  status: string;
}

export type UpdateControllerResponse = Controller;

export async function updateControllerApi(controller_id: string, payload: UpdateControllerRequest): Promise<UpdateControllerResponse> {
  const url = `${getBackendUrl()}/api/v1/controller/${controller_id}`
  const body = {
    name: payload.name,
    total_relays: payload.total_relays,
    status: payload.status,
  }
  const res = await axiosClient.patch<UpdateControllerResponse>(url.replace(getBackendUrl(), ''), body)
  return res.data as UpdateControllerResponse
}

export const useUpdateControllerApi = <T = UpdateControllerResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const updateController = useCallback(async (controller_id: string, payload: UpdateControllerRequest) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await updateControllerApi(controller_id, payload)
      setState({ data: data as T, loading: false, error: null })
      return data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) })
      throw error
    }
  }, [])

  return { ...state, updateController }
}


