import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

import { type PromotionCondition } from '@shared/types/promotion/PromotionCondition';
import { type PromotionReward } from '@shared/types/promotion/PromotionReward';
import { type PromotionLimit } from '@shared/types/promotion/PromotionLimit';
import { type PromotionCampaign } from '@shared/types/promotion/PromotionCampaign';
import { PromotionCampaignStatusEnum } from '@shared/enums/PromotionCampaignStatusEnum';

export type CreatePromotionCampaignRequest = {
  name: string;
  description: string;
  status: PromotionCampaignStatusEnum;
  start_time: string;
  end_time: string | null;
  conditions: PromotionCondition[];
  rewards: PromotionReward[];
  limits: PromotionLimit[];
}

export type CreatePromotionCampaignResponse = PromotionCampaign;

export async function createPromotionCampaignApi(payload: CreatePromotionCampaignRequest): Promise<CreatePromotionCampaignResponse> {
  const url = `${getBackendUrl()}/api/v1/promotion-campaign`
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
  const res = await axiosClient.post<CreatePromotionCampaignResponse>(url.replace(getBackendUrl(), ''), body)
  return res.data as CreatePromotionCampaignResponse
}

export const useCreatePromotionCampaignApi = <T = CreatePromotionCampaignResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const createPromotionCampaign = useCallback(async (payload: CreatePromotionCampaignRequest) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await createPromotionCampaignApi(payload)
      setState({ data: data as T, loading: false, error: null })
      return data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) })
      throw error
    }
  }, [])

  return { ...state, createPromotionCampaign }
}

