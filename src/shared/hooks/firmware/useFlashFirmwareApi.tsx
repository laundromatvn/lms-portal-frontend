import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

import { type Firmware } from '@shared/types/Firmware'

export type FlashFirmwareRequest = {
  all_controllers: boolean;
  controller_ids: string[];
}

export type FlashFirmwareResponse = boolean

export async function flashFirmwareApi(firmwareId: string, request: FlashFirmwareRequest): Promise<FlashFirmwareResponse> {
  const url = `${getBackendUrl()}/api/v1/firmware/${firmwareId}/flash`
  const response = await axiosClient.post<FlashFirmwareResponse>(url.replace(getBackendUrl(), ''), request)
  return response.data
}

export const useFlashFirmwareApi = <T = FlashFirmwareResponse>() => {
  const [state, setState] = useState<ApiState<boolean>>({
    data: null,
    loading: false,
    error: null,
  })

  const flashFirmware = useCallback(async (firmwareId: string, request: FlashFirmwareRequest ) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const response = await flashFirmwareApi(firmwareId, request)
      setState({ data: true, loading: false, error: null })
      return response as boolean
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) })
      throw error
    }
  }, [])

  return { ...state, flashFirmware }
}

