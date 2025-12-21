import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

import { type Tenant } from '@shared/types/tenant';
import { TenantStatusEnum } from '@shared/enums/TenantStatusEnum';

export type DeleteTenantResponse = boolean;

export async function deleteTenantApi(tenantId: string): Promise<DeleteTenantResponse> {
  const url = `${getBackendUrl()}/api/v1/tenant/${tenantId}`

  const res = await axiosClient.delete<DeleteTenantResponse>(
    url.replace(getBackendUrl(), ''),
  )
  return res.data as DeleteTenantResponse
}

export const useDeleteTenantApi = () => {
  const [state, setState] = useState<ApiState<DeleteTenantResponse>>({
    data: null,
    loading: false,
    error: null
  })

  const deleteTenant = useCallback(async (tenantId: string) => {
    setState({ data: false as DeleteTenantResponse, loading: true, error: null })
    try {
      const data = await deleteTenantApi(tenantId)
      setState({ data: true as DeleteTenantResponse, loading: false, error: null })
      return data as DeleteTenantResponse
    } catch (error: any) {
      setState({ data: false as DeleteTenantResponse, loading: false, error: new Error(error.message) })
      throw error
    }
  }, [])

  return { ...state, deleteTenant }
}
