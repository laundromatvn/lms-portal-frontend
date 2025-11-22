import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types'
import axiosClient from '@core/axiosClient'

export type GetPortalDashboardAccessResponse = {
  portal_dashboard_overview: boolean;
  portal_dashboard_order_management: boolean;
  portal_dashboard_machine_management: boolean;
}

export const useGetPortalDashboardAccessApi = <T = GetPortalDashboardAccessResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const getPortalDashboardAccess = useCallback(async () => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    const url = `${getBackendUrl()}/api/v1/dashboard/access`

    try {
      const response = await axiosClient.get<GetPortalDashboardAccessResponse>(
        url.replace(getBackendUrl(), ''),
      )

      setState({ data: response.data as T, loading: false, error: null });
      return response.data as GetPortalDashboardAccessResponse
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) });
      throw error;
    }
  }, [setState]);

  return { ...state, getPortalDashboardAccess };
}
