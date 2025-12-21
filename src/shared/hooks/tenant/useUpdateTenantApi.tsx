import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

import { type Tenant } from '@shared/types/tenant';
import { TenantStatusEnum } from '@shared/enums/TenantStatusEnum';

export type UpdateTenantRequest = {
  name?: string;
  status?: TenantStatusEnum;
  contact_email?: string;
  contact_phone_number?: string;
  contact_full_name?: string;
  contact_address?: string;
}

export type UpdateTenantResponse = Tenant;

export async function updateTenantApi(tenantId: string, request: UpdateTenantRequest): Promise<UpdateTenantResponse> {
  const url = `${getBackendUrl()}/api/v1/tenant/${tenantId}`

  const res = await axiosClient.patch<UpdateTenantResponse>(
    url.replace(getBackendUrl(), ''),
    request
  )
  return res.data as UpdateTenantResponse
}

export const useUpdateTenantApi = <T = UpdateTenantResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null
  })

  const updateTenant = useCallback(async (tenantId: string, request: UpdateTenantRequest) => {
    setState({ data: null as unknown as T, loading: true, error: null })

    try {
      const data = await updateTenantApi(tenantId, request)
      setState({ data: data as T, loading: false, error: null })
      return data as T
    } catch (error: any) {
      setState({ data: null as unknown as T, loading: false, error: new Error(error.message) })
      throw error
    }
  }, [])

  return { ...state, updateTenant }
}
