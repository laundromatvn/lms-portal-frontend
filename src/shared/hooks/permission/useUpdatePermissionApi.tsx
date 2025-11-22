import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

export type UpdatePermissionRequest = {
  name: string;
  code: string;
  description: string;
  is_enabled: boolean;
}

export type UpdatePermissionResponse = boolean;

export async function updatePermissionApi(permissionId: string, request: UpdatePermissionRequest): Promise<UpdatePermissionResponse> {
  const url = `${getBackendUrl()}/api/v1/permission/${permissionId}`
  const payload = {
    name: request.name,
    code: request.code,
    description: request.description,
    is_enabled: request.is_enabled,
  }

  const res = await axiosClient.patch<UpdatePermissionResponse>(url.replace(getBackendUrl(), ''), payload)
  return res.data as UpdatePermissionResponse
}

export const useUpdatePermissionApi = <T = UpdatePermissionResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const updatePermission = useCallback(async (permissionId: string, payload: UpdatePermissionRequest) => {
    setState((prev) => ({ ...prev, data: false as T, loading: true, error: null }))
    try {
      const data = await updatePermissionApi(permissionId, payload)
      setState({ data: true as T, loading: false, error: null })
      return data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) })
      throw error
    }
  }, [])

  return { ...state, updatePermission }
}
