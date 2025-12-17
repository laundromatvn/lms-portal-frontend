import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types'
import { type Store } from '@shared/types/store';

import axiosClient from '@core/axiosClient'

export type ListAssignedStoresRequest = {
  user_id: string;
  page: number;
  page_size: number;
}

export type ListAssignedStoresResponse = {
  data: Store[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export const useListAssignedStoresApi = <T = ListAssignedStoresResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const listAssignedStores = useCallback(async ({ user_id, page = 1, page_size = 10 }: ListAssignedStoresRequest) => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    const url = `${getBackendUrl()}/api/v1/user/${user_id}/assigned-stores`

    let queryParams = {
      page,
      page_size,
    } as Record<string, any>;

    try {
      const response = await axiosClient.get<T>(
        url.replace(getBackendUrl(), ''),
        { params: { ...queryParams } }
      )

      setState({ data: response.data as T, loading: false, error: null });
      return response.data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) });
      throw error;
    }
  }, [setState]);

  return { ...state, listAssignedStores };
}
