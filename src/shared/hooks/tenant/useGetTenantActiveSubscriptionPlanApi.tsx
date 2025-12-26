import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

import { type Subscription } from '@shared/types/Subscription';

export type GetTenantActiveSubscriptionPlanResponse = Subscription;

export async function getTenantActiveSubscriptionPlanApi(tenantId: string): Promise<GetTenantActiveSubscriptionPlanResponse> {
  const url = `${getBackendUrl()}/api/v1/tenant/${tenantId}/subscription`

  const res = await axiosClient.get<GetTenantActiveSubscriptionPlanResponse>(
    url.replace(getBackendUrl(), ''),
  )
  return res.data as GetTenantActiveSubscriptionPlanResponse
}

export const useGetTenantActiveSubscriptionPlanApi = <T = GetTenantActiveSubscriptionPlanResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null
  })

  const getTenantActiveSubscriptionPlan = useCallback(async (tenantId: string) => {
    setState({ data: null as unknown as T, loading: true, error: null })

    try {
      const data = await getTenantActiveSubscriptionPlanApi(tenantId)
      setState({ data: data as T, loading: false, error: null })
      return data as T
    } catch (error: any) {
      setState({ data: null as unknown as T, loading: false, error: new Error(error.message) })
      throw error
    }
  }, [])

  return { ...state, getTenantActiveSubscriptionPlan }
}
