import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'

import { type ApiState } from '@shared/hooks/types'

import axiosClient from '@core/axiosClient'

export type GetInternalPaymentInformationResponse = {
  bank_code: string;
  bank_name: string;
  bank_account: string;
  bank_account_name: string;
  bank_account_qr_code: string;
}

export const useGetInternalPaymentInformationApi = <T = GetInternalPaymentInformationResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const getInternalPaymentInformation = useCallback(async () => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    const url = `${getBackendUrl()}/api/v1/payment/internal-payment-information`

    try {
      const response = await axiosClient.get<T>(url.replace(getBackendUrl(), ''))

      setState({ data: response.data as T, loading: false, error: null });
      return response.data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) });
      throw error;
    }
  }, [setState]);

  return { ...state, getInternalPaymentInformation };
}
