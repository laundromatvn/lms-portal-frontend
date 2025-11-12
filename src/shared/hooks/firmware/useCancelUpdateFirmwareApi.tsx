import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

export type CancelUpdateFirmwareResponse = boolean

export async function cancelUpdateFirmwareApi(firmwareDeploymentId: string): Promise<CancelUpdateFirmwareResponse> {
  const url = `${getBackendUrl()}/api/v1/firmware-deployment/${firmwareDeploymentId}/cancel`
  const response = await axiosClient.post<CancelUpdateFirmwareResponse>(url.replace(getBackendUrl(), ''))
  return response.data as boolean
}

export const useCancelUpdateFirmwareApi = () => {
  const [state, setState] = useState<ApiState<CancelUpdateFirmwareResponse>>({
    data: null,
    loading: false,
    error: null,
  })

  const cancelUpdateFirmware = useCallback(async (firmwareDeploymentId: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const response = await cancelUpdateFirmwareApi(firmwareDeploymentId)
      setState({ data: response as CancelUpdateFirmwareResponse, loading: false, error: null })
      return response
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) })
      throw error
    }
  }, [])

  return { ...state, cancelUpdateFirmware }
}
