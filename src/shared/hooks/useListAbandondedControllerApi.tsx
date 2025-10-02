import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types';

import axiosClient from '@core/axiosClient';

export type ListAbandondedControllerRequest = {
  page: number;
  page_size: number;
}

export type ListAbandondedControllerResponse = {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  data: string[];
}

export const useListAbandondedControllerApi = <T = ListAbandondedControllerResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const listAbandondedController = useCallback(async ({ page = 1, page_size = 10 }: ListAbandondedControllerRequest) => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    const url = `${getBackendUrl()}/api/v1/controller/abandoned`

    const queryParams = {
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

  return { ...state, listAbandondedController };
}
