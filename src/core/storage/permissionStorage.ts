export const STORAGE_KEY = 'lms_portal.permissions'

export const permissionStorage = {
  save(permissions: string[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(permissions))
    } catch {
      // ignore storage errors
    }
  },
  load(): string[] | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return null
      const parsed = JSON.parse(raw) as string[]
      if (parsed && Array.isArray(parsed) && parsed.every(p => typeof p === 'string')) {
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

