export const OTPActionEnum = {
  SIGN_IN: 'sign_in',
  VERIFY_FOR_STORE_CONFIGURATION_ACCESS: 'verify_for_store_configuration_access',
} as const;

export type OTPActionEnum = typeof OTPActionEnum[keyof typeof OTPActionEnum];
