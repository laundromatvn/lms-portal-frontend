import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

import { type Firmware } from '@shared/types/Firmware'
import { type FirmwareStatusEnum } from '@shared/enums/FirmwareStatusEnum'
import { type FirmwareVersionTypeEnum } from '@shared/enums/FirmwareVersionTypeEnum'

export type AddFirmwareRequest = {
  name: string;
  version: string;
  description: string;
  status: FirmwareStatusEnum;
  version_type: FirmwareVersionTypeEnum;
  object_name: string;
}

export type AddFirmwareResponse = Firmware

export async function addFirmwareApi(firmware: AddFirmwareRequest): Promise<AddFirmwareResponse> {
  const url = `${getBackendUrl()}/api/v1/firmware`
  const response = await axiosClient.post<AddFirmwareResponse>(url.replace(getBackendUrl(), ''), firmware)
  return response.data
}

export const useAddFirmwareApi = <T = AddFirmwareResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const addFirmware = useCallback(async (firmware: AddFirmwareRequest ) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const response = await addFirmwareApi(firmware)
      setState({ data: response as T, loading: false, error: null })
      return response as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) })
      throw error
    }
  }, [])

  return { ...state, addFirmware }
}

