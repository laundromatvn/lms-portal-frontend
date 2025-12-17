import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types'
import { type Store } from '@shared/types/store';

import axiosClient from '@core/axiosClient'

export type AssignMemberToStoresRequest = {
  user_id: string;
  store_ids: string[];
}

export type AssignMemberToStoresResponse = boolean;

export const useAssignMemberToStoresApi = <T = AssignMemberToStoresResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const assignMemberToStores = useCallback(async ({ user_id, store_ids }: AssignMemberToStoresRequest) => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    const url = `${getBackendUrl()}/api/v1/user/${user_id}/assign-member-to-stores`

    try {
      await axiosClient.post<T>(
        url.replace(getBackendUrl(), ''),
        { store_ids }
      )

      setState({ data: true as T, loading: false, error: null });

      return true
    } catch (error: any) {
      setState({ data: false as T, loading: false, error: new Error(error.message) });
      throw error;
    }
  }, [setState]);

  return { ...state, assignMemberToStores };
}
