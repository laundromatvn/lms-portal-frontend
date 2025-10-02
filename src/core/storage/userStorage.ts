import { type User } from '@shared/types/user'

const STORAGE_KEY = 'lms.user.v1'

export const userStorage = {
  save(user: User): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } catch {
      // ignore storage errors
    }
  },
  load(): User | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return null
      const parsed = JSON.parse(raw) as User
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


