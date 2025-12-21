import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

import { type User } from '@shared/types/user';
import { type UserRoleEnum } from '@shared/enums/UserRoleEnum';

export type CreateUserRequest = {
  email: string;
  phone: string;
  role: UserRoleEnum;
  password: string;
}

export type CreateUserResponse = User;

export async function createUserApi(payload: CreateUserRequest): Promise<CreateUserResponse> {
  const url = `${getBackendUrl()}/api/v1/user`
  const body = {
    email: payload.email,
    phone: payload.phone,
    password: payload.password,
    role: payload.role,
  }

  const res = await axiosClient.post<CreateUserResponse>(url.replace(getBackendUrl(), ''), body)
  return res.data as CreateUserResponse
}

export const useCreateUserApi = <T = CreateUserResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const createUser = useCallback(async (payload: CreateUserRequest) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await createUserApi(payload)
      setState({ data: data as T, loading: false, error: null })
      return data as T
    } catch (error: any) {
      setState({ data: null, loading: false, error: new Error(error.message) })
      throw error
    }
  }, [])

  return { ...state, createUser }
}
