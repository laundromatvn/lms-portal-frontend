import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types'
import { type PermissionGroup } from '@shared/types/PermissionGroup';

import axiosClient from '@core/axiosClient'

export type ListPermissionGroupRequest = {
  page?: number;
  page_size?: number;
  tenant_id?: string;
  search?: string;
  order_by?: string;
  order_direction?: 'asc' | 'desc';
}

export type ListPermissionGroupResponse = {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  data: PermissionGroup[];
}

export const useListPermissionGroupApi = <T = ListPermissionGroupResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const listPermissionGroup = useCallback(async (queryParams: ListPermissionGroupRequest) => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    const url = `${getBackendUrl()}/api/v1/permission-group`

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

  return { ...state, listPermissionGroup };
}
