import { type Tenant } from '@shared/types/tenant'

const STORAGE_KEY = 'lms.tenant.v1'

export const tenantStorage = {
  save(tenant: Tenant): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tenant))
    } catch {
      // ignore storage errors
    }
  },
  load(): Tenant | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return null
      const parsed = JSON.parse(raw) as Tenant
      if (parsed && typeof parsed === 'object' && typeof (parsed as any).id === 'string') {
        return parsed
      }
      return null
    } catch {
      return null
    }
  },
  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  },
}


