import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types'

import axiosClient from '@core/axiosClient'

export const useDeletePermissionGroupApi = <T = boolean>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: false as T,
    loading: false,
    error: null,
  });

  const deletePermissionGroup = useCallback(async (permission_group_id: string) => {
    setState({ data: false as T, loading: true, error: null });

    const url = `${getBackendUrl()}/api/v1/permission-group/${permission_group_id}`

    try {
      await axiosClient.delete<T>(
        url.replace(getBackendUrl(), ''),
      )

      setState({ data: true as T, loading: false, error: null });
      return true as T
    } catch (error: any) {
      setState({ data: false as T, loading: false, error: new Error(error.message) });
      throw error;
    }
  }, []);

  return { ...state, deletePermissionGroup };
}
