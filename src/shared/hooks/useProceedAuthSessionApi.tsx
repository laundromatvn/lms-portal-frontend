import axios from 'axios'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

import { type AuthSession } from '@shared/types/AuthSession';

export type ProceedAuthSessionRequest = {
  sessionId: string;
}

export type ProceedAuthSessionResponse = AuthSession;

export async function proceedAuthSessionApi(sessionId: string): Promise<ProceedAuthSessionResponse> {
  const url = `${getBackendUrl()}/api/v1/auth/sso/session/${sessionId}/proceed`

  const res = await axios.post<ProceedAuthSessionResponse>(url)
  return res.data as ProceedAuthSessionResponse
}

export const useProceedAuthSessionApi = <T = ProceedAuthSessionResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const proceedAuthSession = useCallback(async ({ sessionId }: ProceedAuthSessionRequest) => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));
    try {
      const response = await proceedAuthSessionApi(sessionId);
      setState({ data: response.data as T, loading: false, error: null });
      return response.data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) });
      throw error;
    }
  }, [setState]);

  return { ...state, proceedAuthSession };
}
