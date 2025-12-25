import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types'
import { type PermissionGroup } from '@shared/types/PermissionGroup';

import axiosClient from '@core/axiosClient'

export type UpdatePermissionGroupPayload = {
  name?: string;
  description?: string;
  is_enabled?: boolean;
}

export type UpdatePermissionGroupResponse = boolean;

export const useUpdatePermissionGroupApi = <T = UpdatePermissionGroupResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const updatePermissionGroup = useCallback(async (permission_group_id: string, payload: UpdatePermissionGroupPayload) => {
    setState({ data: false as T, loading: true, error: null });

    const url = `${getBackendUrl()}/api/v1/permission-group/${permission_group_id}`

    try {
      await axiosClient.patch<T>(
        url.replace(getBackendUrl(), ''),
        payload
      )

      setState({ data: true as T, loading: false, error: null });
      return true as T
    } catch (error: any) {
      setState({ data: false as T, loading: false, error: new Error(error.message) });
      throw error;
    }
  }, []);

  return { ...state, updatePermissionGroup };
}
