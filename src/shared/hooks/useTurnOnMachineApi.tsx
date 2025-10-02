import axios from 'axios'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types'

export type TurnOnMachineRequest = {
  relay_id: number;
}

export type TurnOnMachineResponse = any;

export const useTurnOnMachineApi = <T = TurnOnMachineResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const turnOnMachine = useCallback(async ({ relay_id }: TurnOnMachineRequest) => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    const url = `${getBackendUrl()}/api/v1/actions/demo/turn-on`

    const headers = {
      'Content-Type': 'application/json',
    }

    const body = {
      relay_id,
    }

    try {
      const response = await axios.post<T>(url, body, { headers })

      setState({ data: response.data as T, loading: false, error: null });
      return response.data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) });
      throw error;
    }
  }, [setState]);

  return { ...state, turnOnMachine };
}