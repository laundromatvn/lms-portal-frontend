import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

export type ReleaseFirmwareResponse = boolean;

export async function releaseFirmwareApi(firmwareId: string): Promise<ReleaseFirmwareResponse> {
  const url = `${getBackendUrl()}/api/v1/firmware/${firmwareId}/release`
  const response = await axiosClient.post<ReleaseFirmwareResponse>(url.replace(getBackendUrl(), ''))
  return response.data
}

export const useReleaseFirmwareApi = () => {
  const [state, setState] = useState<ApiState<ReleaseFirmwareResponse>>({
    data: null,
    loading: false,
    error: null,
  })

  const releaseFirmware = useCallback(async (firmwareId: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const response = await releaseFirmwareApi(firmwareId)
      setState({ data: true, loading: false, error: null })
      return response as ReleaseFirmwareResponse
    } catch (error: any) {
      setState({ data: false, loading: false, error: new Error(error.message) })
      throw error
    }
  }, [])

  return { ...state, releaseFirmware }
}

