export const FirmwareDeploymentStatusEnum = {
  NEW: 'NEW',
  REBOOTING: 'REBOOTING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
} as const;

export type FirmwareDeploymentStatusEnum = typeof FirmwareDeploymentStatusEnum[keyof typeof FirmwareDeploymentStatusEnum];  
