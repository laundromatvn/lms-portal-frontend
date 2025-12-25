import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types'
import { type Permission } from '@shared/types/Permission';

import axiosClient from '@core/axiosClient'

export type ListGroupPermissionsRequest = {
  page?: number;
  page_size?: number;
  search?: string;
  order_by?: string;
  order_direction?: 'asc' | 'desc';
}

export type ListGroupPermissionsResponse = {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  data: Permission[];
}

export const useListGroupPermissionsApi = <T = ListGroupPermissionsResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const listGroupPermissions = useCallback(async (permission_group_id: string, queryParams: ListGroupPermissionsRequest) => {
    setState({data: null, loading: true, error: null});

    const url = `${getBackendUrl()}/api/v1/permission-group/${permission_group_id}/permissions`

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

  return { ...state, listGroupPermissions };
}
