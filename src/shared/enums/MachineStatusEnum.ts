export const MachineStatusEnum = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export type MachineStatusEnum = typeof MachineStatusEnum[keyof typeof MachineStatusEnum];
