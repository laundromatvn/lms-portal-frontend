export const FirmwareStatusEnum = {
  DRAFT: 'DRAFT',
  RELEASED: 'RELEASED',
  OUT_OF_DATE: 'OUT_OF_DATE',
  DEPRECATED: 'DEPRECATED',
} as const;

export type FirmwareStatusEnum = typeof FirmwareStatusEnum[keyof typeof FirmwareStatusEnum];
