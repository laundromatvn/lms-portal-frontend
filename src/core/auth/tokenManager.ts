import { tenantStorage } from '@core/storage/tenantStorage'
import { tokenStorage, type TokenBundle } from '@core/storage/tokenStorage'
import { userStorage } from '@core/storage/userStorage'
import { permissionStorage } from '@core/storage/permissionStorage'
import { refreshToken, type RefreshTokenResponse } from './authApi'
import { getJwtExpiration } from './jwtUtils'
import { getMePermissionsApi } from '@shared/hooks/useGetMePermissions'
import {
  ACCESS_TOKEN_EXPIRY_BUFFER_MS,
  REFRESH_TOKEN_EXPIRY_BUFFER_MS,
  PROACTIVE_REFRESH_THRESHOLD_MS,
  ACCESS_TOKEN_TTL_SECONDS,
  REFRESH_TOKEN_TTL_SECONDS,
  REFRESH_TOKEN_RETRY_INTERVAL_MS,
} from '@core/constant'

type TokenState = TokenBundle | null

class TokenManager {
  private tokens: TokenState
  private refreshingPromise: Promise<string> | null
  private authListeners: Array<(authenticated: boolean) => void>

  constructor() {
    this.tokens = tokenStorage.load()
    this.refreshingPromise = null
    this.authListeners = []
  }

  setTokens(tokens: TokenBundle): void {
    this.tokens = tokens
    tokenStorage.save(tokens)
    this.notifyAuthChanged(true)
  }

  clear(): void {
    this.tokens = null
    tokenStorage.clear()
    try {
      tenantStorage.clear()
      userStorage.clear()
      permissionStorage.clear()
    } catch {}
    this.notifyAuthChanged(false)
  }

  getAccessToken(): string | null {
    return this.tokens?.accessToken ?? null
  }

  isAuthenticated(): boolean {
    return !!this.tokens
  }

  subscribeAuth(listener: (authenticated: boolean) => void): () => void {
    this.authListeners.push(listener)
    // immediate notify with current state
    try {
      listener(this.isAuthenticated())
    } catch {}
    return () => {
      this.authListeners = this.authListeners.filter((l) => l !== listener)
    }
  }

  private notifyAuthChanged(authenticated: boolean): void {
    for (const listener of this.authListeners) {
      try {
        listener(authenticated)
      } catch {}
    }
  }

  isAccessTokenExpired(bufferMs = ACCESS_TOKEN_EXPIRY_BUFFER_MS): boolean {
    if (!this.tokens) return true
    const now = Date.now()
    return now + bufferMs >= this.tokens.accessTokenExp
  }

  isRefreshTokenExpired(bufferMs = REFRESH_TOKEN_EXPIRY_BUFFER_MS): boolean {
    if (!this.tokens) return true
    const now = Date.now()
    return now + bufferMs >= this.tokens.refreshTokenExp
  }

  async ensureValidAccessToken(): Promise<string | null> {
    if (!this.tokens) return null

    if (!this.isAccessTokenExpired()) {
      return this.tokens.accessToken
    }

    if (this.isRefreshTokenExpired()) {
      this.clearAndRedirectToSignIn()
      return null
    }

    if (!this.refreshingPromise) {
      this.refreshingPromise = this.performRefresh()
        .finally(() => {
          this.refreshingPromise = null
        })
    }

    try {
      return await this.refreshingPromise
    } catch (error) {
      // If refresh token expired during retry, clear and redirect
      if (this.isRefreshTokenExpired()) {
        this.clearAndRedirectToSignIn()
      }
      return null
    }
  }

  async proactiveRefresh(): Promise<void> {
    if (!this.tokens) return
    const now = Date.now()
    
    const accessTokenTimeToExpiry = this.tokens.accessTokenExp - now
    const refreshTokenTimeToExpiry = this.tokens.refreshTokenExp - now
    
    if (accessTokenTimeToExpiry <= ACCESS_TOKEN_EXPIRY_BUFFER_MS || 
        refreshTokenTimeToExpiry <= PROACTIVE_REFRESH_THRESHOLD_MS) {
      await this.ensureValidAccessToken()
    }
  }

  // Force a refresh using the current refresh token, even if access token is still valid
  async refreshAccessNow(): Promise<void> {
    if (!this.tokens) return
    if (this.isRefreshTokenExpired()) {
      this.clearAndRedirectToSignIn()
      return
    }
    if (!this.refreshingPromise) {
      this.refreshingPromise = this.performRefresh()
        .finally(() => {
          this.refreshingPromise = null
        })
    }
    try {
      await this.refreshingPromise
    } catch {
      if (this.isRefreshTokenExpired()) {
        this.clearAndRedirectToSignIn()
      }
    }
  }

  // Alias for clarity if we later differentiate behaviors
  async rotateRefreshTokenNow(): Promise<void> {
    await this.refreshAccessNow()
  }

  private async performRefresh(): Promise<string> {
    if (!this.tokens) throw new Error('No tokens to refresh')

    // Retry indefinitely until success or refresh token expires
    while (true) {
      // Check if refresh token expired before each retry attempt
      if (this.isRefreshTokenExpired()) {
        throw new Error('Refresh token expired')
      }

      try {
        const res: RefreshTokenResponse = await refreshToken(this.tokens.refreshToken)

        const accessTokenExp = getJwtExpiration(res.access_token) ?? 
          (Date.now() + ((res as any)?.expires_in ? (res as any).expires_in * 1000 : ACCESS_TOKEN_TTL_SECONDS * 1000))

        const refreshTokenExp = getJwtExpiration(res.refresh_token) ?? 
          (Date.now() + ((res as any)?.refresh_expires_in ? (res as any).refresh_expires_in * 1000 : REFRESH_TOKEN_TTL_SECONDS * 1000))

        const updated: TokenBundle = {
          accessToken: res.access_token,
          refreshToken: res.refresh_token,
          accessTokenExp,
          refreshTokenExp,
        }
        this.setTokens(updated)
        
        // Fetch and save permissions after successful token refresh
        try {
          const permissionsResponse = await getMePermissionsApi()
          permissionStorage.save(permissionsResponse.permissions)
        } catch {
          // Ignore permission fetch errors - tokens are still valid
        }
        
        return updated.accessToken
      } catch (error: any) {
        // If it's an authentication error (401, 403), don't retry - token is invalid/expired
        const status = error?.response?.status
        if (status === 401 || status === 403) {
          throw error
        }

        // For network/server errors, wait and retry
        // The loop will continue and check refresh token expiration on next iteration
        await this.sleep(REFRESH_TOKEN_RETRY_INTERVAL_MS)
      }
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  private clearAndRedirectToSignIn(): void {
    this.clear()
    try {
      window.location.href = '/auth/sign-in'
    } catch {}
  }
}

export const tokenManager = new TokenManager()
export type { TokenBundle }


