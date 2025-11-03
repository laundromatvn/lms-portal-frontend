import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types'
import { type PromotionCampaign } from '@shared/types/promotion/PromotionCampaign';
import { PromotionCampaignStatusEnum } from '@shared/enums/PromotionCampaignStatusEnum';

import axiosClient from '@core/axiosClient'

export type ListPromotionCampaignRequest = {
  page?: number;
  page_size?: number;
  tenant_id?: string;
  status?: PromotionCampaignStatusEnum;
  start_time?: string;
  end_time?: string;
  query?: string;
  order_by?: string;
  order_direction?: string;
}

export type ListPromotionCampaignResponse = {
  data: PromotionCampaign[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export const useListPromotionCampaignApi = <T = ListPromotionCampaignResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const listPromotionCampaign = useCallback(async (queryParams: ListPromotionCampaignRequest) => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    const url = `${getBackendUrl()}/api/v1/promotion-campaign`

    try {
      const response = await axiosClient.get<T>(
        url.replace(getBackendUrl(), ''),
        { params: queryParams }
      )

      setState({ data: response.data as T, loading: false, error: null });
      return response.data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) });
      throw error;
    }
  }, [setState]);

  return { ...state, listPromotionCampaign };
}
