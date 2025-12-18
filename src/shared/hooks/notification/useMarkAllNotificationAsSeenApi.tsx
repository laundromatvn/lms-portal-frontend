import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

export type MarkAllNotificationAsSeenResponse = boolean;

export async function markAllNotificationAsSeenApi(): Promise<MarkAllNotificationAsSeenResponse> {
  const url = `${getBackendUrl()}/api/v1/notification/mark-all-as-seen`

  const res = await axiosClient.post<MarkAllNotificationAsSeenResponse>(url.replace(getBackendUrl(), ''))
  return res.data as MarkAllNotificationAsSeenResponse
}

export const useMarkAllNotificationAsSeenApi = <T = MarkAllNotificationAsSeenResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const markAllNotificationAsSeen = useCallback(async () => {
    setState({ data: false as T, loading: true, error: null });
    try {
      const data = await markAllNotificationAsSeenApi()
      setState({ data: true as T, loading: false, error: null })
      return data as T
    } catch (error: any) {
      setState({ data: false as T, loading: false, error: new Error(error.message) })
      throw error
    }
  }, [])

  return { ...state, markAllNotificationAsSeen }
}
