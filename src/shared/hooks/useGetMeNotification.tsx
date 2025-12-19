import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

import { type Notification } from '@shared/types/Notification';
import type { NotificationTypeEnum } from '@shared/enums/NotificationTypeEnum';

export type GetMeNotificationRequest = {
  page?: number;
  page_size?: number;
  type?: NotificationTypeEnum;
}

export type GetMeNotificationResponse = {
  data: Notification[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export async function getMeNotificationApi(params: GetMeNotificationRequest): Promise<GetMeNotificationResponse> {
  const url = `${getBackendUrl()}/api/v1/user/me/notifications`

  const res = await axiosClient.get<GetMeNotificationResponse>(
    url.replace(getBackendUrl(), ''),
    { params }
  )
  return res.data as GetMeNotificationResponse
}

export const useGetMeNotificationApi = <T = GetMeNotificationRequest>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const getMeNotification = useCallback(async (params: GetMeNotificationRequest) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await getMeNotificationApi(params)
      setState({ data: data as T, loading: false, error: null })
      return data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) })
      throw error
    }
  }, [])

  return { ...state, getMeNotification }
}
