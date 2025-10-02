export type TokenBundle = {
  accessToken: string;
  refreshToken: string;
  accessTokenExp: number; // epoch ms
  refreshTokenExp: number; // epoch ms
};

const STORAGE_KEY = 'auth.tokens.v1';

export const tokenStorage = {
  save(tokens: TokenBundle): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
    } catch {
      // ignore storage errors
    }
  },
  load(): TokenBundle | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as TokenBundle;
      if (
        typeof parsed?.accessToken === 'string' &&
        typeof parsed?.refreshToken === 'string' &&
        typeof parsed?.accessTokenExp === 'number' &&
        typeof parsed?.refreshTokenExp === 'number'
      ) {
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  },
  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  },
};


