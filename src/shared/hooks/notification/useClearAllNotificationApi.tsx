import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

export type ClearAllNotificationResponse = boolean;

export async function clearAllNotificationApi(): Promise<ClearAllNotificationResponse> {
  const url = `${getBackendUrl()}/api/v1/user/me/notifications/clear`

  const res = await axiosClient.post<ClearAllNotificationResponse>(url.replace(getBackendUrl(), ''))
  return res.data as ClearAllNotificationResponse
}

export const useClearAllNotificationApi = <T = ClearAllNotificationResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const clearAllNotification = useCallback(async () => {
    setState({ data: false as T, loading: true, error: null });
    try {
      const data = await clearAllNotificationApi()
      setState({ data: true as T, loading: false, error: null })
      return data as T
    } catch (error: any) {
      setState({ data: false as T, loading: false, error: new Error(error.message) })
      throw error
    }
  }, [])

  return { ...state, clearAllNotification }
}
