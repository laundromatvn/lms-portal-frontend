import axios from 'axios'

import { getBackendUrl } from '@shared/utils/env'

export type RefreshTokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number; // seconds
  refresh_expires_in: number; // seconds
};

export async function refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
  const url = `${getBackendUrl()}/api/v1/auth/refresh-token`;
  const headers = { 'Content-Type': 'application/json' };
  const body = { refresh_token: refreshToken };
  const res = await axios.post<RefreshTokenResponse>(url, body, { headers });
  return res.data;
}
