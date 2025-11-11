import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types'
import axiosClient from '@core/axiosClient'

import { type Firmware } from '@shared/types/Firmware';

export type GetFirmwareResponse = Firmware;

export const useGetFirmwareApi = <T = GetFirmwareResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const getFirmware = useCallback(async (firmwareId: string) => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    const url = `${getBackendUrl()}/api/v1/firmware/${firmwareId}`

    try {
      const response = await axiosClient.get<T>(url.replace(getBackendUrl(), ''))

      setState({ data: response.data as T, loading: false, error: null })
      return response.data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) })
      throw error
    }
  }, []);

  return { ...state, getFirmware };
}
