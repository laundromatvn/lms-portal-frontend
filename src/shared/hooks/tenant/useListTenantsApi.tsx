import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

import { type Tenant } from '@shared/types/tenant';
import { TenantStatusEnum } from '@shared/enums/TenantStatusEnum';

export type ListTenantsRequest = {
  page?: number;
  page_size?: number;
  search?: string;
  status?: TenantStatusEnum;
  order_by?: string;
  order_direction?: 'asc' | 'desc';
}

export type ListTenantsResponse = {
  data: Tenant[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export async function listTenantsApi(params: ListTenantsRequest): Promise<ListTenantsResponse> {
  const url = `${getBackendUrl()}/api/v1/tenant`

  const res = await axiosClient.get<ListTenantsResponse>(
    url.replace(getBackendUrl(), ''),
    { params }
  )
  return res.data as ListTenantsResponse
}

export const useListTenantsApi = <T = ListTenantsRequest>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const listTenants = useCallback(async (params: ListTenantsRequest) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await listTenantsApi(params)
      setState({ data: data as T, loading: false, error: null })
      return data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) })
      throw error
    }
  }, [])

  return { ...state, listTenants }
}
