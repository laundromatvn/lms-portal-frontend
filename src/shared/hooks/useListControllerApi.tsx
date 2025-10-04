import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types';

import axiosClient from '@core/axiosClient';

import { type Controller } from '@shared/types/Controller';

export type ListControllerRequest = {
  store_id?: string;
  page: number;
  page_size: number;
}

export type ListControllerResponse = {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  data: Controller[];
}

export const useListControllerApi = <T = ListControllerResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const listController = useCallback(async ({ store_id, page = 1, page_size = 10 }: ListControllerRequest) => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    const url = `${getBackendUrl()}/api/v1/controller`
    const queryParams = { page, page_size, store_id };

    setState({ data: null, loading: false, error: null });

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

  return { ...state, listController };
}
