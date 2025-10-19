import axios from 'axios'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

import { type SystemTask } from '@shared/types/SystemTask';

export type ProcessSystemTaskRequest = {
  sessionId: string;
}

export type ProcessSystemTaskResponse = SystemTask;

export async function processSystemTaskApi(sessionId: string): Promise<ProcessSystemTaskResponse> {
  const url = `${getBackendUrl()}/api/v1/system-task/${sessionId}/process`

  const res = await axios.post<ProcessSystemTaskResponse>(url)
  return res.data as ProcessSystemTaskResponse
}

export const useProcessSystemTaskApi = <T = ProcessSystemTaskResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const processSystemTask = useCallback(async ({ sessionId }: ProcessSystemTaskRequest) => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));
    try {
      const response = await processSystemTaskApi(sessionId);
      setState({ data: response.data as T, loading: false, error: null });
      return response.data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) });
      throw error;
    }
  }, [setState]);

  return { ...state, processSystemTask };
}
