import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

export type RefreshTokenRequest = {
  refreshToken: string;
}

export type RefreshTokenResponse = {
  access_token: string;
  refresh_token: string;
}

export async function refreshTokenApi(refreshToken: string): Promise<RefreshTokenResponse> {
  const url = `${getBackendUrl()}/api/v1/auth/refresh-token`
  const body = { refresh_token: refreshToken }
  const res = await axiosClient.post<RefreshTokenResponse>(url.replace(getBackendUrl(), ''), body)
  return res.data as RefreshTokenResponse
}

export const useRefreshTokenApi = <T = RefreshTokenResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const refresh = useCallback(async ({ refreshToken }: RefreshTokenRequest) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await refreshTokenApi(refreshToken)
      setState({ data: data as T, loading: false, error: null })
      return data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) })
      throw error
    }
  }, [])

  return { ...state, refresh }
}


