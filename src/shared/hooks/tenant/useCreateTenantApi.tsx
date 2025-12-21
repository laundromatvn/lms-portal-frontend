import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'
import { type Tenant } from '@shared/types/tenant';

export type CreateTenantRequest = {
  name: string;
  contact_email: string;
  contact_phone_number: string;
  contact_full_name: string;
  contact_address: string;
}

export type CreateTenantResponse = Tenant;

export async function createTenantApi(payload: CreateTenantRequest): Promise<CreateTenantResponse> {
  const url = `${getBackendUrl()}/api/v1/tenant`
  const body = {
    name: payload.name,
    contact_email: payload.contact_email,
    contact_phone_number: payload.contact_phone_number,
    contact_full_name: payload.contact_full_name,
    contact_address: payload.contact_address,
  }

  const res = await axiosClient.post<CreateTenantResponse>(url.replace(getBackendUrl(), ''), body)
  return res.data as CreateTenantResponse
}

export const useCreateTenantApi = <T = CreateTenantResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const createTenant = useCallback(async (payload: CreateTenantRequest) => {
    setState({ data: null as T, loading: true, error: null })

    try {
      const data = await createTenantApi(payload)
      setState({ data: data as T, loading: false, error: null })
      return data as T;
    } catch (error: any) {
      setState({ data: null as T, loading: false, error: new Error(error.message) });
      throw error;
    }
  }, []);

  return { ...state, createTenant };
}
