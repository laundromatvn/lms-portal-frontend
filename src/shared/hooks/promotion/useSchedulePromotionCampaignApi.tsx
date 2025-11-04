import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

export async function schedulePromotionCampaignApi(promotion_campaign_id: string): Promise<boolean> {
  const url = `${getBackendUrl()}/api/v1/promotion-campaign/${promotion_campaign_id}/schedule`
  await axiosClient.post<boolean>(url.replace(getBackendUrl(), ''))
  return true
}

export const useSchedulePromotionCampaignApi = <T = boolean>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const schedulePromotionCampaign = useCallback(async (promotion_campaign_id: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      await schedulePromotionCampaignApi(promotion_campaign_id)
      setState({ data: true as T, loading: false, error: null })
      return true as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) })
      throw error
    }
  }, [])

  return { ...state, schedulePromotionCampaign }
}

