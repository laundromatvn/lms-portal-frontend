import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types'

import axiosClient from '@core/axiosClient'

export type AddGroupPermissionsPayload = {
  permission_codes: string[];
}

export type AddGroupPermissionsResponse = boolean;

export const useAddGroupPermissionsApi = <T = AddGroupPermissionsResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const addGroupPermissions = useCallback(async (permission_group_id: string, payload: AddGroupPermissionsPayload) => {
    setState({ data: false as T, loading: true, error: null });

    const url = `${getBackendUrl()}/api/v1/permission-group/${permission_group_id}/permissions`

    try {
      await axiosClient.post<T>(
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

  return { ...state, addGroupPermissions };
}

