import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

import { type SelectedMachineOption } from '@shared/types/SelectedMachineOption';
import { type Order } from '@shared/types/Order';

export type CreateOrderRequest = {
  store_id: string;
  machine_selections: SelectedMachineOption[];
}

export type CreateOrderResponse = Order;

export async function createOrderApi(storeId: string, machineSelections: SelectedMachineOption[]): Promise<CreateOrderResponse> {
  const url = `${getBackendUrl()}/api/v1/order`
  const payload = {
    store_id: storeId,
    machine_selections: machineSelections.map(machineSelection => ({
      machine_id: machineSelection.machine.id,
      add_ons: machineSelection.addOns.map(addOn => ({
        type: addOn.addOn.type,
        price: addOn.addOn.price,
        is_default: addOn.addOn.is_default,
        quantity: addOn.quantity,
      })),
    })),
  }

  const res = await axiosClient.post<CreateOrderResponse>(url.replace(getBackendUrl(), ''), payload)
  return res.data as CreateOrderResponse
}

export const useCreateOrderApi = <T = CreateOrderResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const createOrder = useCallback(async (payload: CreateOrderRequest) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await createOrderApi(payload.store_id, payload.machine_selections)
      setState({ data: data as T, loading: false, error: null })
      return data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) })
      throw error
    }
  }, [])

  return { ...state, createOrder }
}
