import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types'
import { type Store } from '@shared/types/store';

import axiosClient from '@core/axiosClient'

export type ListStoreQueryParams = {
  tenant_id?: string;
  page?: number;
  page_size?: number;
  search?: string;
  order_by?: string;
  order_direction?: 'asc' | 'desc';
}

export type ListStoreResponse = {
  data: Store[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export const useListStoreApi = <T = ListStoreResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const listStore = useCallback(async (queryParams: ListStoreQueryParams) => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    const url = `${getBackendUrl()}/api/v1/store`

    let params = { ...queryParams };

    if (params.page) {
      params.page = params.page;
    }

    if (params.page_size) {
      params.page_size = params.page_size;
    }

    if (params.search) {
      params.search = params.search;
    }

    if (params.order_by) {
      params.order_by = params.order_by;
    }

    if (params.order_direction) {
      params.order_direction = params.order_direction;
    }

    try {
      const response = await axiosClient.get<T>(
        url.replace(getBackendUrl(), ''),
        { params }
      )

      setState({ data: response.data as T, loading: false, error: null });
      return response.data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) });
      throw error;
    }
  }, [setState]);

  return { ...state, listStore };
}
