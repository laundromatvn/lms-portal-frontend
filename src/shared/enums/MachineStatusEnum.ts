export const MachineStatusEnum = {
  PENDING_SETUP: 'PENDING_SETUP',
  IDLE: 'IDLE',
  STARTING: 'STARTING',
  BUSY: 'BUSY',
  OUT_OF_SERVICE: 'OUT_OF_SERVICE',
} as const;

export type MachineStatusEnum = typeof MachineStatusEnum[keyof typeof MachineStatusEnum];
