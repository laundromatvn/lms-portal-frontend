import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

export type DeprecateFirmwareResponse = boolean;

export async function deprecateFirmwareApi(firmwareId: string): Promise<DeprecateFirmwareResponse> {
  const url = `${getBackendUrl()}/api/v1/firmware/${firmwareId}/deprecate`
  const response = await axiosClient.post<DeprecateFirmwareResponse>(url.replace(getBackendUrl(), ''))
  return response.data
}

export const useDeprecateFirmwareApi = () => {
  const [state, setState] = useState<ApiState<DeprecateFirmwareResponse>>({
    data: null,
    loading: false,
    error: null,
  })

  const deprecateFirmware = useCallback(async (firmwareId: string) => {
    setState({ data: false, loading: true, error: null })

    try {
      const response = await deprecateFirmwareApi(firmwareId)
      setState({ data: true, loading: false, error: null })
      return true
    } catch (error: any) {
      setState({ data: false, loading: false, error: new Error(error.message) })
      return false
    }
  }, [])

  return { ...state, deprecateFirmware }
}

