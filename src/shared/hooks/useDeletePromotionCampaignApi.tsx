import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

export type DeletePromotionCampaignResponse = boolean;

export async function deletePromotionCampaignApi(promotionCampaignId: string): Promise<boolean> {
  const url = `${getBackendUrl()}/api/v1/promotion-campaign/${promotionCampaignId}`
  const res = await axiosClient.delete<boolean>(url.replace(getBackendUrl(), ''))
  return res.data as boolean
}

export const useDeletePromotionCampaignApi = <T = boolean>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const deletePromotionCampaign = useCallback(async (promotionCampaignId: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      await deletePromotionCampaignApi(promotionCampaignId)
      setState({ data: true as T, loading: false, error: null })
      return true as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) })
      throw error
    }
  }, [])

  return { ...state, deletePromotionCampaign }
}
