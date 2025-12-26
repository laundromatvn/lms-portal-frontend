import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

export type CreateTenantSubscriptionPlanPayload = {
  subscription_plan_id: string;
}

export type CreateTenantSubscriptionPlanResponse = boolean;

export async function createTenantSubscriptionPlanApi(tenantId: string, payload: CreateTenantSubscriptionPlanPayload): Promise<CreateTenantSubscriptionPlanResponse> {
  const url = `${getBackendUrl()}/api/v1/tenant/${tenantId}/subscription-plan`

  const res = await axiosClient.post<CreateTenantSubscriptionPlanResponse>(
    url.replace(getBackendUrl(), ''),
    payload
  )
  return res.data as CreateTenantSubscriptionPlanResponse
}

export const useCreateTenantSubscriptionPlanApi = <T = CreateTenantSubscriptionPlanResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: false as T,
    loading: false,
    error: null
  })

  const createTenantSubscriptionPlan = useCallback(async (tenantId: string, payload: CreateTenantSubscriptionPlanPayload) => {
    setState({ data: false as T, loading: true, error: null })

    try {
      await createTenantSubscriptionPlanApi(tenantId, payload)
      setState({ data: true as T, loading: false, error: null })
      return true as T
    } catch (error: any) {
      setState({ data: false as T, loading: false, error: new Error(error.message) })
      throw error
    }
  }, [])

  return { ...state, createTenantSubscriptionPlan }
}
