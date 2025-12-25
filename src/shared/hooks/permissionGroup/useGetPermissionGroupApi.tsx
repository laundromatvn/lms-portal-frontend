import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types'
import { type PermissionGroup } from '@shared/types/PermissionGroup';

import axiosClient from '@core/axiosClient'

export const useGetPermissionGroupApi = <T = PermissionGroup>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const getPermissionGroup = useCallback(async (permission_group_id: string) => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    const url = `${getBackendUrl()}/api/v1/permission-group/${permission_group_id}`

    try {
      const response = await axiosClient.get<T>(
        url.replace(getBackendUrl(), ''),
      )

      setState({ data: response.data as T, loading: false, error: null });
      return response.data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) });
      throw error;
    }
  }, [setState]);

  return { ...state, getPermissionGroup };
}
