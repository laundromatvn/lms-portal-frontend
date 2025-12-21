import axiosClient from '@core/axiosClient'
import { useCallback, useState } from 'react'

import { getBackendUrl } from '@shared/utils/env'
import { type ApiState } from '@shared/hooks/types'

export type DeleteTenantMemberResponse = boolean;

export async function deleteTenantMemberApi(tenantMemberId: string): Promise<DeleteTenantMemberResponse> {
  const url = `${getBackendUrl()}/api/v1/tenant-member/${tenantMemberId}`

  const res = await axiosClient.delete<DeleteTenantMemberResponse>(
    url.replace(getBackendUrl(), ''),
  )
  return res.data as DeleteTenantMemberResponse
}

export const useDeleteTenantMemberApi = <T = DeleteTenantMemberResponse>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null
  })

  const deleteTenantMember = useCallback(async (tenantMemberId: string) => {
    setState({ data: false as T, loading: true, error: null })

    try {
      await deleteTenantMemberApi(tenantMemberId)
      setState({ data: true as T, loading: false, error: null })
      return true as T
    } catch (error: any) {
      setState({ data: false as T, loading: false, error: new Error(error.message) })
      throw error
    }
  }, [])

  return { ...state, deleteTenantMember }
}
