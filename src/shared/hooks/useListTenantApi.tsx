import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types';
import { type Tenant } from '@shared/types/tenant';

import axiosClient from '@core/axiosClient';

export type ListTenantRequest = {
  page: number;
  page_size: number;
}

export type ListTenantResponse = {
  data: Tenant[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export const useListTenantApi = <T = ListTenantResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const listTenant = useCallback(async ({ page = 1, page_size = 10 }: ListTenantRequest) => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    const url = `${getBackendUrl()}/api/v1/tenant`

    const queryParams = {
      page,
      page_size,
    }

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

  return { ...state, listTenant };
}
