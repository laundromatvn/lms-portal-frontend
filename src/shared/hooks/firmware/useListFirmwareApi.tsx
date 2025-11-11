import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types'
import axiosClient from '@core/axiosClient'

import { type Firmware } from '@shared/types/Firmware';
import { FirmwareVersionTypeEnum } from '@shared/enums/FirmwareVersionTypeEnum';
import { FirmwareStatusEnum } from '@shared/enums/FirmwareStatusEnum';

export type ListFirmwareRequest = {
  page?: number;
  page_size?: number;
  status?: FirmwareStatusEnum;
  version_type?: FirmwareVersionTypeEnum;
  search?: string;
  order_by?: string;
  order_direction?: string;
}

export type ListFirmwareResponse = {
  data: Firmware[];
  total: number;
  page: number;
  page_size: number;
}

export const useListFirmwareApi = <T = ListFirmwareResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const listFirmware = useCallback(async (filters: ListFirmwareRequest) => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    const url = `${getBackendUrl()}/api/v1/firmware`

    const queryParams = {
      page: filters.page,
      page_size: filters.page_size,
      status: filters.status,
      version_type: filters.version_type,
      search: filters.search,
      order_by: filters.order_by,
      order_direction: filters.order_direction,
    }

    try {
      const response = await axiosClient.get<T>(url.replace(getBackendUrl(), ''), { params: queryParams })

      setState({ data: response.data as T, loading: false, error: null })
      return response.data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) })
      throw error
    }
  }, []);

  return { ...state, listFirmware };
}
