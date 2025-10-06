import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

import { type User } from '@shared/types/user';

export type UpdateUserRequest = {
  name: string;
  phone: string;
  role: string;
  status: string;
}

export type UpdateUserResponse = User;

export async function updateUserApi(userId: string, request: UpdateUserRequest): Promise<UpdateUserResponse> {
  const url = `${getBackendUrl()}/api/v1/user/${userId}`
  const payload = {
    name: request.name,
    phone: request.phone,
    role: request.role,
    status: request.status,
  }

  const res = await axiosClient.patch<UpdateUserResponse>(url.replace(getBackendUrl(), ''), payload)
  return res.data as UpdateUserResponse
}

export const useUpdateUserApi = <T = UpdateUserResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const updateUser = useCallback(async (userId: string, payload: UpdateUserRequest) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await updateUserApi(userId, payload)
      setState({ data: data as T, loading: false, error: null })
      return data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) })
      throw error
    }
  }, [])

  return { ...state, updateUser }
}
