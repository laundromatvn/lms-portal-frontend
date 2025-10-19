import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types'

import { OTPActionEnum } from '@shared/enums/OTPActionEnum';

export type GenerateEmailOTPRequest = {
  action: OTPActionEnum;
  data?: any;
}

export type GenerateEmailOTPResponse = any;

export const useGenerateEmailOTPApi = <T = GenerateEmailOTPResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const generateEmailOTP = useCallback(async ({ action, data = {} }: GenerateEmailOTPRequest) => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    const url = `${getBackendUrl()}/api/v1/auth/send-otp`

    const body = {
      action,
      data,
    }

    try {
      const response = await axiosClient.post<T>(url, body)

      setState({ data: response.data as T, loading: false, error: null });
      return response.data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) });
      throw error;
    }
  }, [setState]);

  return { ...state, generateEmailOTP };
}
