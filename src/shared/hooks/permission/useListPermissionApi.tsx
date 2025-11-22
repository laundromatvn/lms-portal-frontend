import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types'
import { type Permission } from '@shared/types/Permission';

import axiosClient from '@core/axiosClient'

export type ListPermissionRequest = {
  page?: number;
  page_size?: number;
  search?: string;
  order_by?: string;
  order_direction?: 'asc' | 'desc';
}

export type ListPermissionResponse = {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  data: Permission[];
}

export const useListPermissionApi = <T = ListPermissionResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const listPermission = useCallback(async (queryParams: ListPermissionRequest) => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    const url = `${getBackendUrl()}/api/v1/permission`

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

  return { ...state, listPermission };
}
