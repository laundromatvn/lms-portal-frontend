import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types'

export type VerifyAbandonedControllerResponse = any;

export const useVerifyAbandonedControllerApi = <T = VerifyAbandonedControllerResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const verifyAbandonedController = useCallback(async (controllerId: string) => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    const url = `${getBackendUrl()}/api/v1/controller/abandoned/${controllerId}/verify`

    try {
      const response = await axiosClient.post<T>(url.replace(getBackendUrl(), ''))

      setState({ data: response.data as T, loading: false, error: null });
      return response.data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) });
      throw error;
    }
  }, [setState]);

  return { ...state, verifyAbandonedController };
}
