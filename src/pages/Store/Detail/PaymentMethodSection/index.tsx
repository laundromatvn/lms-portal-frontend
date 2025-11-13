import React from 'react';

import { type Store } from '@shared/types/store';

import { PaymentMethodStackView } from './Stack';

interface Props {
  store: Store;
}

export const PaymentMethodSection: React.FC<Props> = ({ store }: Props) => {
  return <PaymentMethodStackView store={store} />;
};
