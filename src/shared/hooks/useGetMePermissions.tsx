import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types'
import axiosClient from '@core/axiosClient'

export type GetMePermissionsResponse = {
  permissions: string[];
}

export async function getMePermissionsApi(): Promise<GetMePermissionsResponse> {
  const url = `${getBackendUrl()}/api/v1/user/me/permissions`
  const response = await axiosClient.get<GetMePermissionsResponse>(
    url.replace(getBackendUrl(), ''),
  )
  return response.data as GetMePermissionsResponse
}

export const useGetMePermissionsApi = () => {
  const [state, setState] = useState<ApiState<GetMePermissionsResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const getMePermissions = useCallback(async () => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    try {
      const response = await getMePermissionsApi()
      setState({ data: response, loading: false, error: null });
      return response
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) });
      throw error;
    }
  }, [setState]);

  return { ...state, getMePermissions };
}
