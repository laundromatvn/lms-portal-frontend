import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types';
import { type Machine } from '@shared/types/machine';

import axiosClient from '@core/axiosClient';

export type ListMachineRequest = {
  store_id: string;
  page: number;
  page_size: number;
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

  const listMachine = useCallback(async ({ store_id, page = 1, page_size = 10 }: ListMachineRequest) => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    const url = `${getBackendUrl()}/api/v1/machine`

    const queryParams = {
      store_id,
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
