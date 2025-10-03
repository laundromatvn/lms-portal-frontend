import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

import { type Controller } from '@shared/types/Controller';

export type GetControllerResponse = Controller;

export async function getControllerApi(controller_id: string): Promise<GetControllerResponse> {
  const url = `${getBackendUrl()}/api/v1/controller/${controller_id}`

  const res = await axiosClient.get<GetControllerResponse>(url.replace(getBackendUrl(), ''))
  return res.data as GetControllerResponse
}

export const useGetControllerApi = <T = GetControllerResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const getController = useCallback(async (controller_id: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await getControllerApi(controller_id)
      setState({ data: data as T, loading: false, error: null })
      return data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) })
      throw error
    }
  }, [])

  return { ...state, getController }
}
