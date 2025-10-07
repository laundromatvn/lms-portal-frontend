export const AuthSessionStatusEnum = {
  NEW: 'NEW',
  IN_PROGRESS: 'IN_PROGRESS',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
} as const;

export type AuthSessionStatusEnum = typeof AuthSessionStatusEnum[keyof typeof AuthSessionStatusEnum];
