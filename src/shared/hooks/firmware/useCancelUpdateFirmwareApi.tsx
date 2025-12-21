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
    setState({ data: false, loading: true, error: null })

    try {
      await cancelUpdateFirmwareApi(firmwareDeploymentId)
      setState({ data: true, loading: false, error: null })
      return true
    } catch (error: any) {
      setState({ data: false, loading: false, error: new Error(error.message) })
      return false
    }
  }, [])

  return { ...state, cancelUpdateFirmware }
}
