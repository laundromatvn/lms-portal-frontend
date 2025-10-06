import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

import { type User } from '@shared/types/user';

export type ResetPasswordRequest = {
  password: string;
}

export type ResetPasswordResponse = User;

export async function resetPasswordApi(userId: string, request: ResetPasswordRequest): Promise<ResetPasswordResponse> {
  const url = `${getBackendUrl()}/api/v1/user/${userId}`
  const payload = {
    password: request.password,
  }

  const res = await axiosClient.patch<ResetPasswordResponse>(url.replace(getBackendUrl(), ''), payload)
  return res.data as ResetPasswordResponse
}

export const useResetPasswordApi = <T = ResetPasswordResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const resetPassword = useCallback(async (userId: string, payload: ResetPasswordRequest) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await resetPasswordApi(userId, payload)
      setState({ data: data as T, loading: false, error: null })
      return data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) })
      throw error
    }
  }, [])

  return { ...state, resetPassword }
}
