export const AddOnTypeEnum = {
  COLD_WATER: 'COLD_WATER',
  HOT_WATER: 'HOT_WATER',
  DETERGENT: 'DETERGENT',
  SOFTENER: 'SOFTENER',
  DRYING_DURATION_MINUTE: 'DRYING_DURATION_MINUTE',
  OTHER: 'OTHER',
} as const;

export type AddOnTypeEnum = typeof AddOnTypeEnum[keyof typeof AddOnTypeEnum];
