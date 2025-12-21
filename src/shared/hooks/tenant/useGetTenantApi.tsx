import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

import { type Tenant } from '@shared/types/tenant';

export type GetTenantResponse = Tenant;

export async function getTenantApi(tenantId: string): Promise<GetTenantResponse> {
  const url = `${getBackendUrl()}/api/v1/tenant/${tenantId}`

  const res = await axiosClient.get<GetTenantResponse>(
    url.replace(getBackendUrl(), ''),
  )
  return res.data as GetTenantResponse
}

export const useGetTenantApi = <T = GetTenantResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null
  })

  const getTenant = useCallback(async (tenantId: string) => {
    setState({ data: null as unknown as T, loading: true, error: null })

    try {
      const data = await getTenantApi(tenantId)
      setState({ data: data as T, loading: false, error: null })
      return data as T
    } catch (error: any) {
      setState({ data: null as unknown as T, loading: false, error: new Error(error.message) })
      throw error
    }
  }, [])

  return { ...state, getTenant }
}
