import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

import { PaymentMethodEnum } from '@shared/enums/PaymentMethodEnum';
import { type Payment } from '@shared/types/Payment';

export type CreatePaymentRequest = {
  order_id: string;
  store_id: string;
  tenant_id: string;
  total_amount: number;
  payment_method: PaymentMethodEnum;
}

export type CreatePaymentResponse = Payment;

export async function createPaymentApi(request: CreatePaymentRequest): Promise<CreatePaymentResponse> {
  const url = `${getBackendUrl()}/api/v1/payment`
  const payload = {
    store_id: request.store_id,
    order_id: request.order_id,
    tenant_id: request.tenant_id,
    total_amount: request.total_amount,
    payment_method: request.payment_method,
  }

  const res = await axiosClient.post<CreatePaymentResponse>(url.replace(getBackendUrl(), ''), payload)
  return res.data as CreatePaymentResponse
}

export const useCreatePaymentApi = <T = CreatePaymentResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const createPayment = useCallback(async (payload: CreatePaymentRequest) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await createPaymentApi(payload)
      setState({ data: data as T, loading: false, error: null })
      return data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) })
      throw error
    }
  }, [])

  return { ...state, createPayment }
}
