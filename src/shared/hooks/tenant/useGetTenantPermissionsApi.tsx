import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

import { type Permission } from '@shared/types/Permission';

export type GetTenantPermissionsRequest = {
  page?: number;
  page_size?: number;
  search?: string;
  order_by?: string;
  order_direction?: 'asc' | 'desc';
}

export type GetTenantPermissionsResponse = {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  data: Permission[];
}

export async function getTenantPermissionsApi(tenantId: string, queryParams: GetTenantPermissionsRequest): Promise<GetTenantPermissionsResponse> {
  const url = `${getBackendUrl()}/api/v1/tenant/${tenantId}/permissions`

  const res = await axiosClient.get<GetTenantPermissionsResponse>(
    url.replace(getBackendUrl(), ''),
    { params: queryParams }
  )
  return res.data as GetTenantPermissionsResponse
}

export const useGetTenantPermissionsApi = <T = GetTenantPermissionsResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null
  })

  const getTenantPermissions = useCallback(async (tenantId: string, queryParams: GetTenantPermissionsRequest) => {
    setState({ data: null as unknown as T, loading: true, error: null })

    try {
      const data = await getTenantPermissionsApi(tenantId, queryParams)
      setState({ data: data as T, loading: false, error: null })
      return data as T
    } catch (error: any) {
      setState({ data: null as unknown as T, loading: false, error: new Error(error.message) })
      throw error
    }
  }, [])

  return { ...state, getTenantPermissions }
}
