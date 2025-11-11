export const FirmwareVersionTypeEnum = {
  MAJOR: 'MAJOR',
  MINOR: 'MINOR',
  PATCH: 'PATCH',
} as const;

export type FirmwareVersionTypeEnum = typeof FirmwareVersionTypeEnum[keyof typeof FirmwareVersionTypeEnum];
