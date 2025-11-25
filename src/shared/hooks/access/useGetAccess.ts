import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types'
import axiosClient from '@core/axiosClient'

import type { PortalAccess } from '@shared/types/access/PortalAccess'

export const useGetAccessApi = <T = PortalAccess>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const getAccess = useCallback(async (access_name: string) => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    const queryParams = new URLSearchParams({ name: access_name });

    const url = `${getBackendUrl()}/api/v1/access`

    try {
      const response = await axiosClient.get<PortalAccess>(
        url.replace(getBackendUrl(), ''),
        { params: queryParams }
      )

      setState({ data: response.data as T, loading: false, error: null });
      return response.data as PortalAccess
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) });
      throw error;
    }
  }, [setState]);

  return { ...state, getAccess };
}
