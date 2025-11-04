import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

import { type PromotionCondition } from '@shared/types/promotion/PromotionCondition';
import { type PromotionReward } from '@shared/types/promotion/PromotionReward';
import { type PromotionLimit } from '@shared/types/promotion/PromotionLimit';
import { type PromotionCampaign } from '@shared/types/promotion/PromotionCampaign';
import { PromotionCampaignStatusEnum } from '@shared/enums/PromotionCampaignStatusEnum';

export type UpdatePromotionCampaignRequest = {
  name: string;
  description: string;
  status: PromotionCampaignStatusEnum;
  start_time: string;
  end_time: string | null;
  conditions: PromotionCondition[];
  rewards: PromotionReward[];
  limits: PromotionLimit[];
}

export type UpdatePromotionCampaignResponse = PromotionCampaign;

export async function updatePromotionCampaignApi(promotion_campaign_id: string, payload: UpdatePromotionCampaignRequest): Promise<UpdatePromotionCampaignResponse> {
  const url = `${getBackendUrl()}/api/v1/promotion-campaign/${promotion_campaign_id}`
  const body = {
    name: payload.name,
    description: payload.description,
    status: payload.status,
    start_time: payload.start_time,
    end_time: payload.end_time,
    conditions: payload.conditions,
    rewards: payload.rewards,
    limits: payload.limits,
  }
  const res = await axiosClient.patch<UpdatePromotionCampaignResponse>(url.replace(getBackendUrl(), ''), body)
  return res.data as UpdatePromotionCampaignResponse
}

export const useUpdatePromotionCampaignApi = <T = UpdatePromotionCampaignResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const updatePromotionCampaign = useCallback(async (promotion_campaign_id: string, payload: UpdatePromotionCampaignRequest) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await updatePromotionCampaignApi(promotion_campaign_id, payload)
      setState({ data: data as T, loading: false, error: null })
      return data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) })
      throw error
    }
  }, [])

  return { ...state, updatePromotionCampaign }
}


