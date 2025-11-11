import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types'
import axiosClient from '@core/axiosClient'

import { type ProvisionedController } from '@shared/types/firmware/ProvisionedController';

export type ListProvisionedControllerRequest = {
  page?: number;
  page_size?: number;
  tenant_id?: string;
  store_id?: string;
  search?: string;
  order_by?: string;
  order_direction?: string;
}

export type ListProvisionedControllerResponse = {
  data: ProvisionedController[];
  total: number;
  page: number;
  page_size: number;
}

export const useListProvisionedControllerApi = <T = ListProvisionedControllerResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const listProvisionedController = useCallback(async (firmwareId: string, filters: ListProvisionedControllerRequest) => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    const url = `${getBackendUrl()}/api/v1/firmware/${firmwareId}/provisioned-controllers`

    try {
      const response = await axiosClient.get<T>(url.replace(getBackendUrl(), ''), { params: filters })

      setState({ data: response.data as T, loading: false, error: null })
      return response.data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) })
      throw error
    }
  }, []);

  return { ...state, listProvisionedController };
}
