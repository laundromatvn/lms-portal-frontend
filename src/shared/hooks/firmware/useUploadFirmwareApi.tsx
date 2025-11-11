import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

interface UploadFirmwareRequest {
  file: File
}

export type UploadFirmwareResponse = {
  object_name: string
}

export async function uploadFirmwareApi(request: UploadFirmwareRequest): Promise<UploadFirmwareResponse> {
  const url = `${getBackendUrl()}/api/v1/firmware/upload`
  const headers = {
    'Content-Type': 'multipart/form-data',
  }

  const formData = new FormData();
  formData.append('file', request.file);

  const response = await axiosClient.post<UploadFirmwareResponse>(url.replace(getBackendUrl(), ''), formData, { headers })
  return response.data
}

export const useUploadFirmwareApi = <T = UploadFirmwareResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const uploadFirmware = useCallback(async (request: UploadFirmwareRequest) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const response = await uploadFirmwareApi(request)
      setState({ data: response as T, loading: false, error: null })
      return response as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) })
      throw error
    }
  }, [])

  return { ...state, uploadFirmware }
}

