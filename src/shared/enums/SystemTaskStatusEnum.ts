export const SystemTaskStatusEnum = {
  NEW: 'NEW',
  IN_PROGRESS: 'IN_PROGRESS',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
} as const;

export type SystemTaskStatusEnum = typeof SystemTaskStatusEnum[keyof typeof SystemTaskStatusEnum];
