import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

export type CreateTenantMemberRequest = {
  user_id: string;
  tenant_id: string;
}

export type CreateTenantMemberResponse = any;

export async function createTenantMemberApi(payload: CreateTenantMemberRequest): Promise<CreateTenantMemberResponse> {
  const url = `${getBackendUrl()}/api/v1/tenant-member`
  const body = {
    user_id: payload.user_id,
    tenant_id: payload.tenant_id,
  }
  const res = await axiosClient.post<CreateTenantMemberResponse>(url.replace(getBackendUrl(), ''), body)
  return res.data as CreateTenantMemberResponse
}

export const useCreateTenantMemberApi = <T = CreateTenantMemberResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const createTenantMember = useCallback(async (payload: CreateTenantMemberRequest) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await createTenantMemberApi(payload)
      setState({ data: data as T, loading: false, error: null })
      return data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) })
      throw error
    }
  }, [])

  return { ...state, createTenantMember }
}
