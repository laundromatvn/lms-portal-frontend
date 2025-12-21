import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types'
import { type User } from '@shared/types/user';

import axiosClient from '@core/axiosClient'

export type ListUserTenantAdminRequest = {
  page: number;
  page_size: number;
}

export type ListUserTenantAdminResponse = {
  data: User[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export const useListUserTenantAdminApi = <T = ListUserTenantAdminResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const listUserTenantAdmin = useCallback(async (params: ListUserTenantAdminRequest) => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    const url = `${getBackendUrl()}/api/v1/user/available-tenant-admins`

    try {
      const response = await axiosClient.get<T>(
        url.replace(getBackendUrl(), ''),
        { params }
      )

      setState({ data: response.data as T, loading: false, error: null });
      return response.data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) });
      throw error;
    }
  }, [setState]);

  return { ...state, listUserTenantAdmin };
}
