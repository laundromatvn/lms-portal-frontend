import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

export type CreatePermissionRequest = {
  name: string;
  code: string;
  description?: string;
  is_enabled: boolean;
}

export type CreatePermissionResponse = boolean;

export async function createPermissionApi(request: CreatePermissionRequest): Promise<CreatePermissionResponse> {
  const url = `${getBackendUrl()}/api/v1/permission`
  const payload = {
    name: request.name,
    code: request.code,
    description: request.description,
    is_enabled: request.is_enabled,
  }

  const res = await axiosClient.post<CreatePermissionResponse>(url.replace(getBackendUrl(), ''), payload)
  return res.data as CreatePermissionResponse
}

export const useCreatePermissionApi = <T = CreatePermissionResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const createPermission = useCallback(async (payload: CreatePermissionRequest) => {
    setState((prev) => ({ ...prev, data: false as T, loading: true, error: null }))

    try {
      const data = await createPermissionApi(payload)
      setState({ data: true as T, loading: false, error: null })
      return data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) })
      throw error
    }
  }, [])

  return { ...state, createPermission }
}
