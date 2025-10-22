import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types';
import { type Machine } from '@shared/types/machine';
import { MachineTypeEnum } from '@shared/enums/MachineTypeEnum';
import { MachineStatusEnum } from '@shared/enums/MachineStatusEnum';

import axiosClient from '@core/axiosClient';

export type ListMachineRequest = {
  store_id?: string;
  controller_id?: string;
  page?: number;
  page_size?: number;
  machine_type?: MachineTypeEnum;
  status?: MachineStatusEnum;
  search_value?: string;
  order_by?: string;
  order_direction?: 'asc' | 'desc';
}

export type ListMachineResponse = {
  data: Machine[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export const useListMachineApi = <T = ListMachineResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const listMachine = useCallback(async ({
    store_id,
    controller_id,
    machine_type,
    status,
    page = 1,
    page_size = 10,
    search_value = '',
    order_by = 'relay_no',
    order_direction = 'asc',
  }: ListMachineRequest) => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    const url = `${getBackendUrl()}/api/v1/machine`

    const queryParams = {
      store_id,
      controller_id,
      machine_type,
      status,
      search_value,
      order_by,
      order_direction,
      page,
      page_size,
    }

    try {
      const response = await axiosClient.get<T>(
        url.replace(getBackendUrl(), ''),
        { params: queryParams }
      )

      setState({ data: response.data as T, loading: false, error: null });
      return response.data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) });
      throw error;
    }
  }, [setState]);

  return { ...state, listMachine };
}
