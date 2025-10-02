export const ControllerStatusEnum = {
  NEW: 'NEW',
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export type ControllerStatusEnum = typeof ControllerStatusEnum[keyof typeof ControllerStatusEnum];  