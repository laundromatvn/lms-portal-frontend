import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types'
import axiosClient from '@core/axiosClient'

import type { PortalDashboardAccess } from '@shared/types/access/PortalDashboardAccess'

export const useGetPortalDashboardAccessApi = <T = PortalDashboardAccess>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const getPortalDashboardAccess = useCallback(async () => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    const url = `${getBackendUrl()}/api/v1/dashboard/access`

    try {
      const response = await axiosClient.get<PortalDashboardAccess>(
        url.replace(getBackendUrl(), ''),
      )

      setState({ data: response.data as T, loading: false, error: null });
      return response.data as PortalDashboardAccess
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) });
      throw error;
    }
  }, [setState]);

  return { ...state, getPortalDashboardAccess };
}
