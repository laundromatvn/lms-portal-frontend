import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types';
import { type Machine } from '@shared/types/machine';

import axiosClient from '@core/axiosClient';

export type ListClassifiedStoreMachineResponse = {
  washers: Machine[];
  dryers: Machine[];
}

export const useListClassifiedStoreMachineApi = <T = ListClassifiedStoreMachineResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const listClassifiedStoreMachine = useCallback(async ({ storeId }: { storeId: string }) => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    const url = `${getBackendUrl()}/api/v1/store/${storeId}/classified-machines`

    try {
      const response = await axiosClient.get<T>(
        url.replace(getBackendUrl(), ''),
      )

      setState({ data: response.data as T, loading: false, error: null });
      return response.data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) });
      throw error;
    }
  }, [setState]);

  return { ...state, listClassifiedStoreMachine };
}
