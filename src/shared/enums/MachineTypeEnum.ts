export const MachineTypeEnum = {
  WASHER: 'WASHER',
  DRYER: 'DRYER',
} as const;

export type MachineTypeEnum = typeof MachineTypeEnum[keyof typeof MachineTypeEnum];
