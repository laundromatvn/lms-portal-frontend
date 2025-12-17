import React from 'react';

import { type Store } from '@shared/types/store';

import { ListView } from './ListView';

interface Props {
  store: Store;
}

export const PaymentMethodSection: React.FC<Props> = ({ store }: Props) => {
  return <ListView store={store} />;
};
