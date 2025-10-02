import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import axiosClient from '@core/axiosClient'
import { type ApiState } from '@shared/hooks/types'
import { type LMSProfile } from '@shared/types/LMSProfile';

export type GetMeResponse = LMSProfile;

export const useGetLMSProfileApi = <T = GetMeResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const getLMSProfile = useCallback(async () => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    const url = `${getBackendUrl()}/api/v1/auth/lms-profile`

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

  return { ...state, getLMSProfile };
}
