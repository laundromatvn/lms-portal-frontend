import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

export type MarkNotificationAsSeenResponse = boolean;

export async function markNotificationAsSeenApi(notification_id: string): Promise<MarkNotificationAsSeenResponse> {
  const url = `${getBackendUrl()}/api/v1/notification/${notification_id}/mark-as-seen`

  const res = await axiosClient.post<MarkNotificationAsSeenResponse>(url.replace(getBackendUrl(), ''))
  return res.data as MarkNotificationAsSeenResponse
}

export const useMarkNotificationAsSeenApi = <T = MarkNotificationAsSeenResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const markNotificationAsSeen = useCallback(async (notification_id: string) => {
    setState({ data: false as T, loading: true, error: null });
    try {
      const data = await markNotificationAsSeenApi(notification_id)
      setState({ data: true as T, loading: false, error: null })
      return data as T
    } catch (error: any) {
      setState({ data: false as T, loading: false, error: new Error(error.message) })
      throw error
    }
  }, [])

  return { ...state, markNotificationAsSeen }
}
