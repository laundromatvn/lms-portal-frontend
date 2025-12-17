import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types'

import axiosClient from '@core/axiosClient'

export type DeleteStoreMemberRequest = {
  user_id: string;
  store_id: string;
}

export type DeleteStoreMemberResponse = boolean;

export const useDeleteStoreMemberApi = <T = DeleteStoreMemberResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const deleteStoreMember = useCallback(async ({ user_id, store_id }: DeleteStoreMemberRequest) => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    const url = `${getBackendUrl()}/api/v1/user/${user_id}/assigned-stores/${store_id}`

    try {
      await axiosClient.delete<T>(
        url.replace(getBackendUrl(), ''),
      )

      setState({ data: true as T, loading: false, error: null });
      return true
    } catch (error: any) {
      setState({ data: false as T, loading: false, error: new Error(error.message) });
      throw error;
    }
  }, [setState]);

  return { ...state, deleteStoreMember };
}
