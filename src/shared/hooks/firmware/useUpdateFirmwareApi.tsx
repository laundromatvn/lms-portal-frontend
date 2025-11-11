import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

import { type Firmware } from '@shared/types/Firmware'
import { type FirmwareStatusEnum } from '@shared/enums/FirmwareStatusEnum'
import { type FirmwareVersionTypeEnum } from '@shared/enums/FirmwareVersionTypeEnum'

export type UpdateFirmwareRequest = {
  name: string;
  version: string;
  description: string;
  status: FirmwareStatusEnum;
  version_type: FirmwareVersionTypeEnum;
}

export type UpdateFirmwareResponse = Firmware

export async function updateFirmwareApi(firmwareId: string, request: UpdateFirmwareRequest): Promise<UpdateFirmwareResponse> {
  const url = `${getBackendUrl()}/api/v1/firmware/${firmwareId}`
  const response = await axiosClient.patch<UpdateFirmwareResponse>(url.replace(getBackendUrl(), ''), request)
  return response.data
}

export const useUpdateFirmwareApi = <T = UpdateFirmwareResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const updateFirmware = useCallback(async (firmwareId: string, request: UpdateFirmwareRequest ) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const response = await updateFirmwareApi(firmwareId, request)
      setState({ data: response as T, loading: false, error: null })
      return response as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) })
      throw error
    }
  }, [])

  return { ...state, updateFirmware }
}

