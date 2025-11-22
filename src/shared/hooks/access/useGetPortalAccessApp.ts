import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types'
import axiosClient from '@core/axiosClient'

import type { PortalAccess } from '@shared/types/access/PortalAccess'

export const useGetPortalAccessAppApi = <T = PortalAccess>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const getPortalAccessApp = useCallback(async () => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    const url = `${getBackendUrl()}/api/v1/portal/access`

    try {
      const response = await axiosClient.get<PortalAccess>(
        url.replace(getBackendUrl(), ''),
      )

      setState({ data: response.data as T, loading: false, error: null });
      return response.data as PortalAccess
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) });
      throw error;
    }
  }, [setState]);

  return { ...state, getPortalAccessApp };
}
