import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types'
import axiosClient from '@core/axiosClient'

import { type ProvisioningController } from '@shared/types/firmware/ProvisioningController';
import { FirmwareDeploymentStatusEnum } from '@shared/enums/FirmwareDeploymentStatusEnum';

export type ListProvisioningControllerRequest = {
  page?: number;
  page_size?: number;
  deployment_status?: FirmwareDeploymentStatusEnum;
  search?: string;
  order_by?: string;
  order_direction?: string;
}

export type ListProvisioningControllerResponse = {
  data: ProvisioningController[];
  total: number;
  page: number;
  page_size: number;
}

export const useListProvisioningControllerApi = <T = ListProvisioningControllerResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const listProvisioningController = useCallback(async (firmwareId: string, filters: ListProvisioningControllerRequest) => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    const url = `${getBackendUrl()}/api/v1/firmware/${firmwareId}/provisioning-controllers`

    try {
      const response = await axiosClient.get<T>(url.replace(getBackendUrl(), ''), { params: filters })

      setState({ data: response.data as T, loading: false, error: null })
      return response.data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) })
      throw error
    }
  }, []);

  return { ...state, listProvisioningController };
}
