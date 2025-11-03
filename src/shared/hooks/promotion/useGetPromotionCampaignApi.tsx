import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types'
import axiosClient from '@core/axiosClient'

import { type PromotionCampaign } from '@shared/types/promotion/PromotionCampaign';

export type GetPromotionCampaignResponse = PromotionCampaign;

export const useGetPromotionCampaignApi = <T = GetPromotionCampaignResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const getPromotionCampaign = useCallback(async (promotion_campaign_id: string) => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    const url = `${getBackendUrl()}/api/v1/promotion-campaign/${promotion_campaign_id}`

    try {
      const response = await axiosClient.get<T>(url.replace(getBackendUrl(), ''))

      setState({ data: response.data as T, loading: false, error: null })
      return response.data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) })
      throw error
    }
  }, []);

  return { ...state, getPromotionCampaign };
}
