import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types'

import axiosClient from '@core/axiosClient'
import { type PermissionGroup } from '@shared/types/PermissionGroup';

export type CreatePermissionGroupPayload = {
  name?: string;
  description?: string;
  is_enabled?: boolean;
  tenant_id?: string;
}

export type CreatePermissionGroupResponse = boolean;

export const useCreatePermissionGroupApi = <T = CreatePermissionGroupResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const createPermissionGroup = useCallback(async (payload: CreatePermissionGroupPayload) => {
    setState({ data: false as T, loading: true, error: null });

    const url = `${getBackendUrl()}/api/v1/permission-group`

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

  return { ...state, createPermissionGroup };
}
